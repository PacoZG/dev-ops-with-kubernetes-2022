const express = require("express");
const axios = require("axios").default;
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { connect, StringCodec } = require("nats");

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 8080;
const natsServerUrl = process.env.NATS_SERVER_URL;

const DAILY_PIC_PATH = path.join(__dirname, "/public/daily-pic.jpg");

console.log("Starting todos backend");

let lastDailyImageFetch = null;

const broadcasterIds = [];
const sc = StringCodec();
let connection = null;
let broadcastersSub = null;

async function establishNatsConnection() {
  try {
    connection = await connect({ servers: natsServerUrl });
    broadcastersSub = connection.subscribe("broadcasters");

    console.info("Connection established!");
  } catch (error) {
    console.error(error);
  }
}

async function updateBroadcasters() {
  if (connection === null || broadcastersSub === null) {
    console.info("No connection yet, trying again on the next tick.");
    return;
  }

  (async () => {
    for await (const m of broadcastersSub) {
      const decodedData = sc.decode(m.data);
      const parsedData = JSON.parse(decodedData);

      if (
        broadcasterIds.findIndex((id) => parsedData.broadcasterId === id) === -1
      ) {
        console.log(
          "Received message that a new broadcaster is online with the ID of",
          parsedData.broadcasterId
        );
        broadcasterIds.push(parsedData.broadcasterId);
        console.log("Currently active broadcasters:", broadcasterIds);
      }
    }
  })();
}

const validateDailyPicCache = async () => {
  const lastFetch = lastDailyImageFetch?.valueOf() || new Date().valueOf();
  const hoursSinceLastFetch = Math.abs(
    (lastFetch - new Date().valueOf()) / 36e5
  );

  if (!lastDailyImageFetch || hoursSinceLastFetch > 24) {
    const writer = fs.createWriteStream(DAILY_PIC_PATH);

    try {
      const date = new Date();
      date.setHours(date.getHours() - 8);

      const response = await axios({
        method: "GET",
        url: "https://picsum.photos/1200",
        responseType: "stream",
      });

      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", () => {
          console.log("Downloaded new daily image!");
          lastDailyImageFetch = new Date();
          resolve();
        });
        writer.on("error", (err) => {
          console.error(err);
          reject();
        });
      });
    } catch (error) {
      console.error(error);
    }

    writer.destroy();
  } else {
    console.log(
      `Daily image is still fresh, last fetched ${hoursSinceLastFetch} hours ago.`
    );
  }
};

const getDailyPic = async (req, res) => {
  await validateDailyPicCache();
  res.sendFile(DAILY_PIC_PATH);
};

const getTodos = async (req, res) => {
  const todos = await prisma.todo.findMany();
  res.json(todos);
};

const handleReadinessCheck = async (req, res) => {
  try {
    await prisma.todo.count();
    res.status(200).send("Database connection is established!");
  } catch (error) {
    res.status(500).send("Not ready yet!");
  }
};

const handleServerStarted = async () => {
  await establishNatsConnection();
  setInterval(updateBroadcasters, 3000);
  console.log(`Server listening on port ${port}!`);
};

const postTodo = async (req, res) => {
  const message = req.body.message;
  if (typeof message === "string" && message.length >= 140) {
    console.error("Message is too long!");
    res.status(400).send("Message is too long!");
    return;
  }

  const createdTodo = await prisma.todo.create({ data: { message } });
  console.log(`A todo was created with the message: "${message}"`);

  connection.publish(
    "todos",
    sc.encode(
      JSON.stringify({
        broadcasterId:
          broadcasterIds[Math.floor(Math.random() * broadcasterIds.length)],
        ...createdTodo,
      })
    )
  );
};

const markTodoDone = async (req, res) => {
  const todoId = req.query.id;
  const doneTodo = await prisma.todo.update({
    where: { id: todoId },
    data: { done: true },
  });

  console.log(`A todo with ID ${todoId} was completed!`);
  res.json(doneTodo);
};

async function handleGracefulCloseApp() {
  console.info("Closing connections...");
  if (connection !== null) {
    await connection.drain();
  }

  console.info("Good bye!");
}

process.on("SIGTERM", handleGracefulCloseApp);

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.get("/", (req, res) => res.send("Todo server online!"));

app.get("/ready", handleReadinessCheck);

app.get("/todos", getTodos);
app.put("/todos", markTodoDone);

app.get("/daily-pic", getDailyPic);

app.post("/todos", postTodo);

app.listen(port, handleServerStarted);

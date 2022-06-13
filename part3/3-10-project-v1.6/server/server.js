const express = require("express");
const axios = require("axios").default;
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 8080;
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

const DAILY_PIC_PATH = path.join(__dirname, "/public/daily-pic.jpg");

let lastDailyImageFetch = null;

console.log("Starting todos backend");

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

const handleServerStarted = () => {
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
  res.json(createdTodo);
};

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", clientUrl);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => res.send("Todo server online!"));
app.get("/todos", getTodos);
app.get("/daily-pic", getDailyPic);
app.post("/todos", postTodo);

app.listen(port, handleServerStarted);

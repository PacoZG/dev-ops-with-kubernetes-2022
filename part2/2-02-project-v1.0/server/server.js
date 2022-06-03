const express = require("express");
const axios = require("axios").default;
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

const DAILY_PIC_PATH = path.join(__dirname, "/public/daily-pic.jpg");

let lastDailyImageFetch = null;
const todos = [
  { id: crypto.randomUUID(), message: "Todo 1" },
  { id: crypto.randomUUID(), message: "Todo 2" },
  { id: crypto.randomUUID(), message: "Todo 3" },
];

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

const getTodos = (req, res) => {
  res.json(todos);
};

const handleServerStarted = () => {
  console.log(`Server listening on port ${port}!`);
};

const postTodo = async (req, res) => {
  const message = req.body.message;
  todos.push({ id: crypto.randomUUID(), message });
  res.json(todos);
};

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", clientUrl);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/todos", getTodos);
app.get("/daily-pic", getDailyPic);
app.post("/todos", postTodo);

app.listen(port, handleServerStarted);

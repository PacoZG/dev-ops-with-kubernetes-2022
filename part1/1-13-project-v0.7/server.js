const express = require("express");
const axios = require("axios").default;
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const port = process.env.PORT || 3000;
const version = process.env.VERSION || "none";

let lastDailyImageFetch = null;
const todos = [
  { id: crypto.randomUUID(), message: "Todo 1" },
  { id: crypto.randomUUID(), message: "Todo 2" },
  { id: crypto.randomUUID(), message: "Todo 3" },
];

console.log("Starting server version", version);

const validateDailyPicCache = async () => {
  const lastFetch = lastDailyImageFetch?.valueOf() || new Date().valueOf();
  const hoursSinceLastFetch = Math.abs(
    (lastFetch - new Date().valueOf()) / 36e5
  );

  if (!lastDailyImageFetch || hoursSinceLastFetch > 24) {
    const writer = fs.createWriteStream("./public/daily-pic.jpg");

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

const getIndexHtml = async (req, res) => {
  await validateDailyPicCache();
  res.sendFile(path.join(__dirname, "/index.html"));
};

const getTodos = (req, res) => {
  res.json(todos);
};

const handleServerStarted = () => {
  console.log(`Server version ${version} listening on port ${port}!`);
};

const postTodo = (req, res) => {
  const message = req.body.message;
  todos.push({ id: crypto.randomUUID(), message });
  res.json(todos);
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.get("/", getIndexHtml);
app.get("/todos", getTodos);
app.post("/todos", postTodo);

app.listen(port, handleServerStarted);

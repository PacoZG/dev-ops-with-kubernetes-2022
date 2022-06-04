const crypto = require("crypto");
const express = require("express");

const randomHash = crypto.randomUUID();
const app = express();

const port = process.env.PORT || "8081";
const message = process.env.MESSAGE || "";

let logs = null;

async function saveTimeAndHashEveryFiveSeconds() {
  while (true) {
    const timeAndHash = `${
      message !== "" ? message + "\n" : ""
    }${new Date().toISOString()}: ${randomHash}`;
    logs = timeAndHash;
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.error("Error while writing:", error);
    }
  }
}

const handleServerStarted = () => {
  saveTimeAndHashEveryFiveSeconds();
  console.log(`Log server listening on port ${port}!`);
};

const getLogs = (req, res) => {
  res.json(logs);
};

app.use(express.json());
app.get("/logs", getLogs);

app.listen(port, handleServerStarted);

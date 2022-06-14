const express = require("express");
const path = require("path");
const axios = require("axios");

const port = process.env.PORT || 3000;
const serverUrl = process.env.VITE_SERVER_URL;

const app = express();

const handleServerStarted = () => {
  console.log(`Client server started on port ${port}!`);
};

const handleReadinessCheck = async (req, res) => {
  try {
    const response = await axios.get(serverUrl);
    if (parseInt(response.status) >= 400) {
      res.status(500).send("API is not ready!");
    } else {
      res.status(200).send("API is ready!");
    }
  } catch (error) {
    res.status(500).send("Failed to request readiness.");
    console.error(error);
  }
};

app.use(express.static(path.join(__dirname, "/dist")));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/dist/index.html"))
);
app.get("/ready", handleReadinessCheck);

app.listen(port, handleServerStarted);

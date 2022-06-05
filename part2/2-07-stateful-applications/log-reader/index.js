const express = require("express");
const axios = require("axios").default;

const app = express();
const port = process.env.PORT || 3000;
const logServerUrl = process.env.LOG_SERVER_URL || "/logs";
const pingPongServerUrl = process.env.PING_PONG_SERVER_URL || "/pingpong";

const fetchLogs = async () => {
  const response = await axios.get(logServerUrl);

  return response.data;
};

const fetchPongs = async () => {
  const response = await axios.get(pingPongServerUrl);

  return response.data;
};

const handleServerStarted = () => {
  console.log(`Server listening on port ${port}!`);
};

const handleStatusRequest = async (req, res) => {
  let result = null;

  try {
    const logContents = await fetchLogs();
    const pingPongs = await fetchPongs();

    result = `${logContents}\nPing / Pongs: ${pingPongs}`;
  } catch (error) {
    console.error(error);
  }

  res.send(result);
};

app.get("/", handleStatusRequest);
app.listen(port, handleServerStarted);

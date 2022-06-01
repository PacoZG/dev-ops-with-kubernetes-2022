const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

let pongs = 0;

const handleServerStarted = () => {
  console.log(`Server listening on port ${port}!`);
};

const handlePong = async (req, res) => {
  pongs++;
  res.json(pongs);
};

app.use(express.json());
app.get("/pingpong", handlePong);

app.listen(port, handleServerStarted);

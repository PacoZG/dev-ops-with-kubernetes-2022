const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
let count = 0;

const handleServerStarted = () => {
    console.log(`Server listening on port ${port}!`);
};

const handlePong = (req, res) => {
  res.send(`pong ${count}`);
  count++;
};

app.get('/pingpong', handlePong);
app.listen(port, handleServerStarted);
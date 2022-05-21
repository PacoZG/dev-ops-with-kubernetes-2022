const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const handleServerStarted = () => {
  console.log(`Server listening on port ${port}!`);
};

const getIndexHtml = (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
};

app.get('/', getIndexHtml);
app.listen(port, handleServerStarted);
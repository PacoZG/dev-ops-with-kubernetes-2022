const express = require('express');
const fs = require('fs/promises');

const app = express();
const port = process.env.PORT || 3000;
const pongFilePath = process.env.PONG_FILE_PATH || './pingpongs.txt';

const handleServerStarted = () => {
    console.log(`Server listening on port ${port}!`);
};

const readCurrentPongs = async () => {
  let result = null;

  try {
    result = await fs.readFile(pongFilePath, 'utf8');
  } catch (error) {
    console.error(error);
  }

  return result;
}

const writePongs = async (pongs) => {
  try {
    await fs.writeFile(pongFilePath, pongs, { flag: 'w+' });
  } catch (error) {
    console.error(error);
  }
}

const handlePong = async (req, res) => {
  try {
    const pongCount = parseInt(await readCurrentPongs() || '0');
    await writePongs((pongCount + 1).toString());
    res.send(`pong ${pongCount}`);
  } catch (error) {
    console.error(error);
    res.send(null);
  }
};

app.get('/pingpong', handlePong);
app.listen(port, handleServerStarted);
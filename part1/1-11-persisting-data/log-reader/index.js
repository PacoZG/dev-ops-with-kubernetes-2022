const express = require('express');
const fs = require('fs/promises');

const app = express();
const port = process.env.PORT || 3000;
const readPath = process.env.READ_PATH || './log.txt';
const pingPongPath = process.env.PONG_FILE_PATH || './pingpongs.txt';

const handleServerStarted = () => {
    console.log(`Server listening on port ${port}!`);
};

const handleStatusRequest = async (req, res) => {
    let result = null;

    try {
        const logContents = await fs.readFile(readPath, 'utf8');
        const pingPongs = await fs.readFile(pingPongPath, 'utf8');
        
        result = `${logContents}\nPing / Pongs: ${pingPongs}`;
    } catch (error) {
        console.error(error);
    }
    
    res.send(result);
};

app.get('/', handleStatusRequest);
app.listen(port, handleServerStarted);
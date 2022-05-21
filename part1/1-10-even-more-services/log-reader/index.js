const express = require('express');
const fs = require('fs/promises');

const app = express();
const port = process.env.PORT || 3000;
const readPath = process.env.READ_PATH || './log.txt';

const handleServerStarted = () => {
    console.log(`Server listening on port ${port}!`);
};

const handleStatusRequest = async (req, res) => {
    let result = null;

    try {
        result = await fs.readFile(readPath, 'utf8');
    } catch (error) {
        console.error(error);
    }
    
    res.send(result);
};

app.get('/', handleStatusRequest);
app.listen(port, handleServerStarted);
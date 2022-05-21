const crypto = require('crypto');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const randomString = crypto.randomUUID();

let currentStatus = null;

async function printEveryFiveSeconds() {
    while (true) {
        currentStatus = `${new Date().toISOString()}: ${randomString}`;
        console.log(currentStatus);
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

const handleServerStarted = () => {
    console.log(`Server listening on port ${port}!`);
    printEveryFiveSeconds();
};

const handleStatusRequest = (req, res) => {
    res.send(currentStatus);
};

app.get('/', handleStatusRequest);
app.listen(port, handleServerStarted);
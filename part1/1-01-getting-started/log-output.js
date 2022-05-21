const crypto = require('crypto');

const randomString = crypto.randomUUID();

async function printEveryFiveSeconds() {
    while (true) {
        console.log(`${new Date().toISOString()}: ${randomString}`);
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

printEveryFiveSeconds();
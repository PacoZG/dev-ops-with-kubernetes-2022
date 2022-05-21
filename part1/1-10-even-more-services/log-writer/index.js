const crypto = require('crypto');
const fs = require('fs/promises');
const randomHash = crypto.randomUUID();

const writePath = process.env.WRITE_PATH || './log.txt';

async function writeEveryFiveSeconds() {
    while (true) {
        const timeAndHash = `${new Date().toISOString()}: ${randomHash}`;
        
        try {
          await new Promise(resolve => setTimeout(resolve, 5000));
          await fs.writeFile(writePath, timeAndHash, { flag: 'w+' });
        } catch (error) {
          console.error(error);
        }
    }
};

writeEveryFiveSeconds();
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

const handleServerStarted = () => {
  console.log(`Server listening on port ${port}!`);
}

app.listen(port, handleServerStarted);
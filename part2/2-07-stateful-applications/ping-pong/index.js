const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

const handleServerStarted = () => {
  console.log(`Server listening on port ${port}!`);
};

const handlePong = async (req, res) => {
  const currentPongCount = await prisma.pong.count();
  await prisma.pong.create({ data: {} });
  res.json(currentPongCount);
};

app.use(express.json());
app.get("/pingpong", handlePong);

app.listen(port, handleServerStarted);

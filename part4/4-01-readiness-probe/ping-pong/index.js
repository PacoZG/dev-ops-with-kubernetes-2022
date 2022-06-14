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

const handleReadiness = async (req, res) => {
  try {
    await prisma.pong.count();
    res.status(200).send("Database connection is established!");
  } catch (error) {
    res.status(500).send("Not ready yet!");
  }
};

app.use(express.json());
app.get("/", (req, res) => res.send("PING PONG!"));
app.get("/pingpong", handlePong);
app.get("/ready", handleReadiness);

app.listen(port, handleServerStarted);

const { connect, StringCodec } = require("nats");
const { Client, Intents } = require("discord.js");
const { randomUUID } = require("crypto");

const broadcasterId = randomUUID();
const natsServerUrl = process.env.NATS_SERVER_URL || "http://localhost:4222";
const tickInterval = process.env.TICK_INTERVAL || 3000;
// For some reason, the secret adds white spaces to the value and breaks the discord bot header
const botToken = process.env.DISCORD_TOKEN.trim();
const channelToBroadcastTo = process.env.DISCORD_CHANNEL || "general";
const sc = StringCodec();
const discordClient = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

let connection = null;
let todosSub = null;

async function establishConnection() {
  try {
    connection = await connect({ servers: natsServerUrl });
    todosSub = connection.subscribe("todos");
    await discordClient.login(botToken);

    setTimeout(() => {
      console.log(
        "Telling everyone that I am online, best regards: ",
        broadcasterId
      );
      connection.publish(
        "broadcasters",
        sc.encode(
          JSON.stringify({
            broadcasterId,
            status: "Online",
          })
        )
      );
    }, 5000);

    console.info("Connection established!");
  } catch (error) {
    console.error(error);
  }
}

async function broadcastQueuedMessages() {
  if (connection === null || todosSub === null) {
    console.info("No connection yet, trying again on the next tick.");
    return;
  }

  const channel = discordClient.channels.cache.find((channel) => {
    return channel.name === channelToBroadcastTo;
  });

  if (!channel) {
    return;
  }

  (async () => {
    for await (const m of todosSub) {
      const decodedData = sc.decode(m.data);
      console.log(
        "There is a new todo:\n",
        JSON.stringify(JSON.parse(decodedData), null, 4)
      );
      if (JSON.parse(decodedData).broadcasterId === broadcasterId) {
        channel.send(
          `\`\`\`${JSON.stringify(JSON.parse(decodedData), null, 4)}\`\`\``
        );
      } else {
        console.log(
          `Not my job to post this message. My id is ${broadcasterId} and the one who got the job goes by the ID ${
            JSON.parse(decodedData).broadcasterId
          }.`
        );
      }
    }
  })();
}

async function handleGracefulCloseApp() {
  console.info("Closing connections...");
  if (connection !== null) {
    await connection.drain();
  }

  console.info("Good bye!");
}

process.on("SIGTERM", handleGracefulCloseApp);

establishConnection();
setInterval(broadcastQueuedMessages, tickInterval);

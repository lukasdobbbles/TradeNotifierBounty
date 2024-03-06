require("dotenv")();

const { Client, GatewayIntentBits, Collection, Events } = require("discord.js");
const fs = require("fs");
const path = require("path");
const clearOldTradeData = require("./utils/clearOldTradeData");
const onReady = require("./events/ready");
const onInteraction = require("./events/interaction");

global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: ["CHANNEL"],
});

client.lockTradeID = {};
client.userIntervals = {}; // Keep track of user intervals

client.commands = new Collection();

client.tradeStoragePath = path.join(__dirname, "data", "tradeStorage.json");
client.userApiKeysPath = path.join(__dirname, "data", "userApiKeys.json");
client.subscriptionTokensPath = path.join(
  __dirname,
  "data",
  "subscriptionTokens.json"
);

client.tradeStorage = fs.existsSync(client.tradeStoragePath)
  ? JSON.parse(fs.readFileSync(client.tradeStoragePath))
  : {};
client.userApiKeys = fs.existsSync(client.userApiKeysPath)
  ? JSON.parse(fs.readFileSync(client.userApiKeysPath))
  : {};
client.subscriptionTokens = fs.existsSync(client.subscriptionTokensPath)
  ? JSON.parse(fs.readFileSync(client.subscriptionTokensPath))
  : {};
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.on(Events.ClientReady, onReady);
client.on(Events.InteractionCreate, onInteraction);

client.login(process.env["token"]);

clearOldTradeData();

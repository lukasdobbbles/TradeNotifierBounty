require("dotenv").config();
const { Client, GatewayIntentBits, Collection, Events } = require("discord.js");
const fs = require("fs");
const path = require("path");
const clearOldTradeData = require("./utils/clearOldTradeData");
const onReady = require("./events/ready");
const onInteraction = require("interaction");
const Database = require("@replit/database");

global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: ["CHANNEL"],
});

client.db = new Database();

client.lockTradeID = {};
client.userIntervals = {}; // Keep track of user intervals

client.commands = new Collection();

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
setInterval(clearOldTradeData, 3600000); // 3600000miliseconds = 1 hour

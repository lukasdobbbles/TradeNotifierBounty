const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("register")
    .addStringOption((option) =>
      option.setName("api-key").setDescription("your API key from torn.com")
    ),
  async execute(interaction) {
    const apiKey = interaction.options.get("api-key").value;
    if (!apiKey) {
      interaction.reply({
        content: "Please provide an API key.",
        ephemeral: true,
      });
      return;
    }
    axios
      .get(`https://api.torn.com/user/?selections=basic&key=${apiKey}`)
      .then(async (response) => {
        const userData = response.data;
        if (
          userData &&
          userData.level &&
          userData.gender &&
          userData.player_id &&
          userData.name &&
          userData.status &&
          userData.status.description
        ) {
          let userApiKeys = await client.db.get("userApiKeys");
          userApiKeys[interaction.user.id] = {
            apiKey: apiKey,
            scriptActive: false,
            subscriptionToken: null,
          };
          await client.db.set("userApiKeys", userApiKeys);
          interaction.reply({
            content: "API key registered successfully.",
            ephemeral: true,
          });
        } else {
          console.log("Invalid response from API:", userData);
          interaction.reply({
            content: "Invalid API key or API is down.",
            ephemeral: true,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        interaction.reply({
          content: "Error fetching user data. Please try again later.",
          ephemeral: true,
        });
      });
  },
};

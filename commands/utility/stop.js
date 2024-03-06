const { SlashCommandBuilder } = require("discord.js");
const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("stop trade processing"),
  async execute(interaction) {
    if (
      !interaction.client.userApiKeys[interaction.user.id] ||
      !interaction.client.userApiKeys[interaction.user.id].scriptActive
    ) {
      interaction.reply({
        content:
          "Trade processing is already stopped or you are not registered.",
        ephemeral: true,
      });
      return;
    }
    interaction.client.userApiKeys[interaction.user.id].scriptActive = false;
    fs.writeFileSync(
      interaction.client.userApiKeysPath,
      JSON.stringify(interaction.client.userApiKeys, null, 2)
    );
    interaction.reply({
      content: "Trade processing stopped.",
      ephemeral: true,
    });
  },
};

const { SlashCommandBuilder } = require("discord.js");
const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unregister")
    .setDescription("unregister"),
  async execute(interaction) {
    delete interaction.client.userApiKeys[interaction.user.id];
    fs.writeFileSync(
      interaction.client.userApiKeysPath,
      JSON.stringify(interaction.client.userApiKeys, null, 2)
    );
    interaction.reply({
      content: "You have been unregistered successfully.",
      ephemeral: true,
    });
  },
};

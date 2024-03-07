const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("stop trade processing"),
  async execute(interaction) {
    let userApiKeys = await client.db.get("userApiKeys");
    if (
      !userApiKeys[interaction.user.id] ||
      !userApiKeys[interaction.user.id].scriptActive
    ) {
      interaction.reply({
        content:
          "Trade processing is already stopped or you are not registered.",
        ephemeral: true,
      });
      return;
    }
    userApiKeys[interaction.user.id].scriptActive = false;
    await client.db.set("userApiKeys", userApiKeys);
    interaction.reply({
      content: "Trade processing stopped.",
      ephemeral: true,
    });
  },
};

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unregister")
    .setDescription("unregister"),
  async execute(interaction) {
    let userApiKeys = await client.db.get("userApiKeys");
    delete userApiKeys[interaction.user.id];
    await client.db.set("userApiKeys", userApiKeys);
    interaction.reply({
      content: "You have been unregistered successfully.",
      ephemeral: true,
    });
  },
};

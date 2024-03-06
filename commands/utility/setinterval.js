const { SlashCommandBuilder } = require("discord.js");
const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setinterval")
    .setDescription("set interval")
    .addIntegerOption((option) =>
      option
        .setName("interval")
        .setDescription(
          "a number between 30 seconds and 5 minutes (300 seconds)"
        )
    ),
  async execute(interaction) {
    const interval = interaction.options.get("interval").value;
    if (isNaN(interval) || interval < 30 || interval > 300) {
      interaction.reply({
        content:
          "Please provide a valid interval between 30 seconds and 5 minutes (300 seconds).",
        ephemeral: true,
      });
      return;
    }
    // Update user's processInterval
    interaction.client.userApiKeys[interaction.user.id] = {
      ...interaction.client.userApiKeys[interaction.user.id],
      processInterval: interval * 1000, // Convert to milliseconds
    };
    fs.writeFileSync(
      interaction.client.userApiKeysPath,
      JSON.stringify(interaction.client.userApiKeys, null, 2)
    );

    // Clear existing interval if present
    if (interaction.client.userIntervals[interaction.user.id]) {
      clearInterval(client.userIntervals[interaction.user.id]);
    }
    // Set new interval
    interaction.client.userIntervals[interaction.user.id] = setInterval(
      () => interaction.client.processTrades(interaction.user.id),
      interval * 1000
    );

    interaction.reply({
      content: `Interval set to ${interval} seconds.`,
      ephemeral: true,
    });
  },
};

const { SlashCommandBuilder } = require("discord.js");
const processTrades = require("../../utils/processTrades");

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
    let userApiKeys = await client.db.get("userApiKeys");
    userApiKeys[interaction.user.id] = {
      ...userApiKeys[interaction.user.id],
      processInterval: interval * 1000, // Convert to milliseconds
    };
    await client.db.set("userApiKeys", userApiKeys);

    // Clear existing interval if present
    if (client.userIntervals[interaction.user.id]) {
      clearInterval(client.userIntervals[interaction.user.id]);
    }
    // Set new interval
    client.userIntervals[interaction.user.id] = setInterval(
      () => processTrades(interaction.user.id),
      interval * 1000
    );

    interaction.reply({
      content: `Interval set to ${interval} seconds.`,
      ephemeral: true,
    });
  },
};

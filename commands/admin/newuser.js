const { SlashCommandBuilder } = require("discord.js");
const generateSubscriptionToken = require("../../utils/generateSubscriptionTokens");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("newuser")
    .setDescription("creates a new user (admin-only command)")
    .addIntegerOption((option) =>
      option
        .setName("weeks")
        .setDescription("a valid integer describing the expiration weeks")
    ),
  async execute(interaction) {
    if (interaction.user.id !== process.env["admin_id"]) {
      interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
      return;
    }
    const weeks = interaction.options.get("weeks").value;
    const token = generateSubscriptionToken(weeks);
    interaction.reply({
      content: `New token generated: ${token}`,
      ephemeral: true,
    });
  },
};

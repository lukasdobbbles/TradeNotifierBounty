const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deletetoken")
    .setDescription("deletes token (admin-only command)")
    .addStringOption((option) =>
      option.setName("token").setDescription("the token to delete"),
    ),
  async execute(interaction) {
    if (interaction.user.id !== process.env["admin_id"]) {
      interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
      return;
    }
    const tokenToDelete = interaction.options.get("token").value;
    if (!tokenToDelete) {
      interaction.reply({
        content: "Please provide a token to delete.",
        ephemeral: true,
      });
      return;
    }

    let subTokens = await interaction.client.db.get("subscriptionTokens");
    if (subTokens[tokenToDelete]) {
      delete subTokens[tokenToDelete];
      await db.set("subscriptionTokens", subTokens);

      interaction.reply({
        content: `Token "${tokenToDelete}" has been deleted successfully.`,
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "Token not found in the subscriptionTokens.",
        ephemeral: true,
      });
    }
  },
};

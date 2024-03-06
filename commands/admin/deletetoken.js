const { SlashCommandBuilder } = require("discord.js");
const { fs } = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deletetoken")
    .setDescription("deletes token (admin-only command)")
    .addStringOption((option) =>
      option.setName("token").setDescription("the token to delete")
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
    if (interaction.client.subscriptionTokens[tokenToDelete]) {
      delete interaction.client.subscriptionTokens[tokenToDelete];
      fs.writeFileSync(
        interaction.client.subscriptionTokensPath,
        JSON.stringify(interaction.client.subscriptionTokens, null, 2)
      );
      interaction.reply({
        content: `Token "${tokenToDelete}" has been deleted successfully.`,
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "Token not found in the client.subscriptionTokens.",
        ephemeral: true,
      });
    }
  },
};

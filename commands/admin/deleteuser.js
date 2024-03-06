const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deleteuser")
    .setDescription("deletes a user (admin-only command)")
    .addStringOption((option) =>
      option.setName("user-to-delete").setDescription("the user ID to delete")
    ),
  async execute(interaction) {
    if (interaction.user.id !== process.env["admin_id"]) {
      interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
      return;
    }
    const userToDelete = interaction.options.get("user-to-delete");
    if (!userToDelete) {
      interaction.reply({
        content: "Please provide a user to delete.",
        ephemeral: true,
      });
      return;
    }
    if (interaction.client.userApiKeys[userToDelete]) {
      delete interaction.client.userApiKeys[userToDelete];
      fs.writeFileSync(
        client.userApiKeysPath,
        JSON.stringify(client.userApiKeys, null, 2)
      );
      interaction.reply({
        content: `User ${userToDelete} has been deleted successfully.`,
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "User not found in the client.userApiKeys.",
        ephemeral: true,
      });
    }
  },
};

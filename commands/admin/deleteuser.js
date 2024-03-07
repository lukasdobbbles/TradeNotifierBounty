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
    let userApiKeys = await interaction.client.db.get("userApiKeys")  
    if (userApiKeys[userToDelete]) {
      delete userApiKeys[userToDelete];
      await interaction.client.db.set("userApiKeys", userApiKeys);
      interaction.reply({
        content: `User ${userToDelete} has been deleted successfully.`,
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "User not found in the userApiKeys.",
        ephemeral: true,
      });
    }
  },
};

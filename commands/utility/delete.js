const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("delete").setDescription("delete"),
  async execute(interaction) {
    const targetUserId = interaction.user.id;
    try {
      if (!interaction.client.readyAt) {
        console.error("Client is not ready, cannot delete messages.");
        return;
      }
      const dmChannel = await client.users
        .fetch(targetUserId)
        .then((user) => user.createDM());
      const botMessages = await dmChannel.messages
        .fetch({ limit: 100 })
        .then((messages) =>
          messages.filter((msg) => msg.user.id === client.user.id)
        );
      for (const msg of botMessages.values()) {
        try {
          await msg.delete();
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Error deleting message ${msg.id}:`, error);
        }
      }
      console.log("Bot messages deleted successfully!");
    } catch (error) {
      console.error("Error deleting messages:", error);
    }
  },
};

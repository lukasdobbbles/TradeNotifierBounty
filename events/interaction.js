module.exports = async (interaction) => {
  if (interaction.isButton() && interaction.customId === "delete_message") {
    try {
      await interaction.message.delete();
      console.log(`Deleted message ${interaction.message.id}`);
    } catch (error) {
      console.error(`Error deleting message: ${error}`);
    }
  }

  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deffered) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
};

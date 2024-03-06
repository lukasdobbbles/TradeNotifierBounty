const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("start").setDescription("start"),
  async execute(interaction) {
    if (!interaction.client.userApiKeys[interaction.user.id]) {
      interaction.reply({
        content:
          "You are not registered. Use `/register <API_KEY>` to register.",
        ephemeral: true,
      });
      return;
    }
    if (
      !interaction.client.userApiKeys[interaction.user.id].subscriptionToken ||
      !interaction.client.subscriptionTokens[
        interaction.client.userApiKeys[interaction.user.id].subscriptionToken
      ]
    ) {
      interaction.reply({
        content:
          "You do not have an active subscription. Use `/subscribe <token>` to activate your subscription.",
        ephemeral: true,
      });
      return;
    }
    if (interaction.client.userApiKeys[interaction.user.id].scriptActive) {
      interaction.reply({
        content: "Trade processing is already running.",
        ephemeral: true,
      });
      return;
    }
    interaction.client.userApiKeys[interaction.user.id].scriptActive = true;
    fs.writeFileSync(
      interaction.client.userApiKeysPath,
      JSON.stringify(interaction.client.userApiKeys, null, 2)
    );
    interaction.reply({
      content: "Trade processing started.",
      ephemeral: true,
    });
  },
};

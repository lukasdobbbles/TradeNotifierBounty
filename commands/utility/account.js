const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("account")
    .setDescription("view subscription data"),
  async execute(interaction) {
    if (
      !interaction.client.userApiKeys[interaction.user.id] ||
      !interaction.client.userApiKeys[interaction.user.id].subscriptionToken
    ) {
      interaction.reply({
        content: "You do not have an active subscription.",
        ephemeral: true,
      });
    } else {
      const token = client.userApiKeys[interaction.user.id].subscriptionToken;
      if (interaction.client.subscriptionTokens[token]) {
        if (interaction.client.subscriptionTokens[token].permanent) {
          interaction.reply({
            content: "Your subscription is Permanent.",
            ephemeral: true,
          });
        } else {
          const expirationDate = new Date(
            client.subscriptionTokens[token].expiration
          );
          const now = new Date();
          const remainingTime = expirationDate - now;
          const daysRemaining = Math.ceil(
            remainingTime / (1000 * 60 * 60 * 24)
          );
          interaction.reply({
            content: `You have ${daysRemaining} days remaining on your subscription.`,
            ephemeral: true,
          });
        }
      } else {
        interaction.reply({
          content: "Your subscription token appears invalid or expired.",
          ephemeral: true,
        });
      }
    }
  },
};

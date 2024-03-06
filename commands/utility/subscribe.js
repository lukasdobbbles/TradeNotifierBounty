const { SlashCommandBuilder } = require("discord.js");
const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("subscribe")
    .setDescription("subscribe")
    .addStringOption((option) =>
      option
        .setName("token-to-subscribe")
        .setDescription("the token to subscribe")
    ),
  async execute(interaction) {
    const tokenToSubscribe =
      interaction.options.get("token-to-subscribe").value;
    if (
      interaction.client.subscriptionTokens[tokenToSubscribe] &&
      !interaction.client.subscriptionTokens[tokenToSubscribe].used
    ) {
      const weeks = client.subscriptionTokens[tokenToSubscribe].weeks;
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + weeks * 7);
      interaction.client.subscriptionTokens[tokenToSubscribe].used = true;
      interaction.client.subscriptionTokens[tokenToSubscribe].expiration =
        expirationDate.toISOString();
      interaction.client.userApiKeys[interaction.user.id] = {
        ...client.userApiKeys[interaction.user.id],
        subscriptionToken: tokenToSubscribe,
        scriptActive: true,
      };
      fs.writeFileSync(
        client.subscriptionTokensPath,
        JSON.stringify(client.subscriptionTokens, null, 2)
      );
      fs.writeFileSync(
        client.userApiKeysPath,
        JSON.stringify(client.userApiKeys, null, 2)
      );
      interaction.reply({
        content: "Subscription activated successfully!",
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "Invalid token or token has already been used.",
        ephemeral: true,
      });
    }
  },
};

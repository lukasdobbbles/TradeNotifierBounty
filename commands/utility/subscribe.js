const { SlashCommandBuilder } = require("discord.js");

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
    let subTokens = await client.db.get("subscriptionTokens");
    let userApiKeys = await client.db.get("userApiKeys");
    if (subTokens[tokenToSubscribe] && !subTokens[tokenToSubscribe].used) {
      const weeks = subTokens[tokenToSubscribe].weeks;
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + weeks * 7);
      subTokens[tokenToSubscribe].used = true;
      subTokens[tokenToSubscribe].expiration = expirationDate.toISOString();
      userApiKeys[interaction.user.id] = {
        ...userApiKeys[interaction.user.id],
        subscriptionToken: tokenToSubscribe,
        scriptActive: true,
      };
      await client.db.set("subscriptionTokens", subTokens);
      await client.db.set("userApiKeys", userApiKeys);
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

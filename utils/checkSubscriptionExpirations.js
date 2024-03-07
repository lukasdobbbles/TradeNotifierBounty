module.exports = async () => {
  const now = new Date();
  let subTokens = await client.db.get("subscriptionTokens");
  let userApiKeys = await client.db.get("userApiKeys")
  Object.entries(subTokens).forEach(([token, data]) => {
    if (data.used && !data.permanent && new Date(data.expiration) < now) {
      Object.entries(client.userApiKeys).forEach(([userId, userDetails]) => {
        if (userDetails.subscriptionToken === token) {
          userApiKeys[userId].scriptActive = false;
        }
      });
      delete subTokens[token];
    }
  });
  client.db.set("subscriptionTokens", subTokens);
  client.db.set("userApiKeys", userApiKeys);
};

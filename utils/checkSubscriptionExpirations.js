const fs = require("node:fs");

module.exports = () => {
  const now = new Date();
  Object.entries(client.subscriptionTokens).forEach(([token, data]) => {
    if (data.used && !data.permanent && new Date(data.expiration) < now) {
      Object.entries(client.userApiKeys).forEach(([userId, userDetails]) => {
        if (userDetails.subscriptionToken === token) {
          client.userApiKeys[userId].scriptActive = false;
        }
      });
      delete client.subscriptionTokens[token];
    }
  });
  fs.writeFileSync(
    client.userApiKeysPath,
    JSON.stringify(client.userApiKeys, null, 2)
  );
  fs.writeFileSync(
    client.subscriptionTokensPath,
    JSON.stringify(client.subscriptionTokens, null, 2)
  );
};

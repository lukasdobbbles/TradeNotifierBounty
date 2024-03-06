const crypto = require("crypto");
const fs = require("node:fs");

module.exports = (weeks) => {
  const token = crypto.randomBytes(10).toString("hex");
  client.subscriptionTokens[token] = {
    weeks: weeks,
    used: false,
    permanent: weeks === 0,
    expiration: null,
  };
  fs.writeFileSync(
    client.subscriptionTokensPath,
    JSON.stringify(client.subscriptionTokens, null, 2)
  );
  return token;
};

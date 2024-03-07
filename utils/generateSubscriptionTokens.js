const crypto = require("crypto");

module.exports = async (weeks) => {
  const token = crypto.randomBytes(10).toString("hex");
  let subTokens = client.db.get("subscriptionTokens");
  subTokens[token] = {
    weeks: weeks,
    used: false,
    permanent: weeks === 0,
    expiration: null,
  };
  await client.db.set("subscriptionTokens", subTokens);
  return token;
};

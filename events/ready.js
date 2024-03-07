const http = require("http");
const checkSubscriptionExpirations = require("../utils/checkSubscriptionExpirations");
const processTrades = require("../utils/processTrades");

module.exports = async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  http
    .createServer((_req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write("Discord Bot is alive!");
      res.end();
    })
    .listen(process.env.PORT || 3000);

  // Set up intervals for each user based on their configured processInterval
  let userApiKeys = await client.db.get("userApiKeys");
  Object.entries(userApiKeys).forEach(
    ([userId, { processInterval }]) => {
      if (processInterval && processInterval > 0) {
        // Clear existing interval if present to prevent duplicates
        if (client.userIntervals[userId]) {
          clearInterval(client.userIntervals[userId]);
        }
        // Set new interval
        client.userIntervals[userId] = setInterval(
          () => processTrades(userId),
          processInterval
        );
      }
    }
  );

  checkSubscriptionExpirations();
};

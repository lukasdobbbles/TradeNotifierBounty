const fs = require("node:fs");

module.exports = () => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const sixHoursAgo = currentTimestamp - 21600;
  for (const tradeID in client.tradeStorage) {
    const tradeData = client.tradeStorage[tradeID];
    if (tradeData.timestamp < sixHoursAgo) {
      delete client.tradeStorage[tradeID];
      console.log(`Cleared old data for trade ID ${tradeID}`);
    }
  }
  fs.writeFileSync(
    client.tradeStoragePath,
    JSON.stringify(client.tradeStorage, null, 2)
  );
};

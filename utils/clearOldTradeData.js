module.exports = async () => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const sixHoursAgo = currentTimestamp - 21600;
  let tradeStorage = await client.db.get("tradeStorage");
  for (const tradeID in tradeStorage) {
    const tradeData = tradeStorage[tradeID];
    if (tradeData.timestamp < sixHoursAgo) {
      delete tradeStorage[tradeID];
      console.log(`Cleared old data for trade ID ${tradeID}`);
    }
  }
  await client.db.set("tradeStorage", tradeStorage);
};

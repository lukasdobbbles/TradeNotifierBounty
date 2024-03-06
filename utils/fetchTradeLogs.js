const fetch = require("node-fetch");

module.exports = async (apiKey, userID) => {
  try {
    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
    const url = `https://api.torn.com/user/?selections=log&cat=94&key=${apiKey}&from=${fiveMinutesAgo}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const tradeLogs = await response.json();
    if (!tradeLogs || !tradeLogs.log) {
      throw new Error(
        `No trade logs found for user ${userID}. Request URL: ${url}. Response data: ${JSON.stringify(
          tradeLogs
        )}`
      );
    }
    return { tradeLogs, userID };
  } catch (error) {
    console.error(`Error fetching trade logs for user ${userID}: ${error}`);
    return null;
  }
};

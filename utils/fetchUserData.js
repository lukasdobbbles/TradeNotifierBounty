const fetch = require("node-fetch");

module.exports = async (apiKey, userID) => {
  const response = await fetch(
    `https://api.torn.com/user/${userID}?selections=profile&key=${apiKey}`
  );
  const userData = await response.json();
  if (!userData || !userData.name) {
    console.error(`Error fetching user data for userID ${userID}`);
    return {
      name: "Unknown",
      status: { description: "Unknown" },
      last_action: { relative: "Unknown" },
    };
  }
  return userData;
};

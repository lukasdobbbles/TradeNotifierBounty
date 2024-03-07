const fetchUserData = require("./fetchUserData");
const fetchTradeLogs = require("./fetchTradeLogs");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = async (userId) => {
  const now = new Date();
  let userApiKeys = await client.db.get("userApiKeys");
  let subTokens = await client.db.get("subscriptionTokens");
  let tradeStorage = await client.db.get("tradeStorage");
  const userSettings = userApiKeys[userId];
  if (!userSettings) return;
  const subscriptionToken = userSettings.subscriptionToken;
  if (!subscriptionToken || !subTokens[subscriptionToken]) {
    console.log(`No active subscription found for user ${userId}`);
    return;
  }
  const subscriptionData = subTokens[subscriptionToken];
  if (
    !subscriptionData.permanent &&
    new Date(subscriptionData.expiration) < now
  ) {
    console.log(`Subscription expired for user ${userId}`);
    return;
  }
  if (!userSettings.scriptActive) return;
  const apiKey = userSettings.apiKey;
  const fetchResult = await fetchTradeLogs(apiKey, userId);
  if (!fetchResult) {
    console.log(
      `Error fetching trade logs for user ${userId}. Continuing to the next user.`,
    );
    return;
  }
  const { tradeLogs, userID } = fetchResult;
  if (!tradeLogs || !tradeLogs.log) {
    console.log(
      `No trade logs found or tradeLogs.log is undefined for user ${userId}`,
    );
    return;
  }
  const userTradeLogs = tradeLogs.log;
  const sortedTradeLogs = Object.values(userTradeLogs).sort(
    (a, b) => a.timestamp - b.timestamp,
  );
  const user = await client.users.fetch(userID);
  for (const logEntry of sortedTradeLogs) {
    if (!logEntry || !logEntry.data) continue;
    const { log, timestamp, data } = logEntry;
    let tradeID = null;
    if (
      typeof data.trade_id === "number" ||
      !data.trade_id.includes("<a href")
    ) {
      tradeID = data.trade_id.toString();
    } else if (
      typeof data.trade_id === "string" &&
      data.trade_id.includes("<a href")
    ) {
      const tradeIdMatch = data.trade_id.match(/ID=(\d+)/);
      tradeID = tradeIdMatch ? tradeIdMatch[1] : null;
    }
    if (!tradeID || !/^\d+$/.test(tradeID)) {
      console.error(`Invalid or missing trade ID: ${tradeID}`);
      continue;
    }
    if (log === 4430 || log === 4410) {
      if (tradeStorage[tradeID] && tradeStorage[tradeID].messageID) {
        const dmChannel = await client.channels.fetch(
          tradeStorage[tradeID].dmChannelID,
        );
        try {
          const message = await dmChannel.messages.fetch(
            tradeStorage[tradeID].messageID,
          );
          await message.delete();
          console.log(`Deleted message for trade ID ${tradeID}`);
          delete tradeStorage[tradeID];
          lockTradeID[tradeID] = true;
        } catch (error) {
          console.error(
            `Error deleting message for trade ID ${tradeID}: ${error}`,
          );
        }
        if (!tradeStorage[tradeID]) {
          tradeStorage[tradeID] = {};
        }
      }
    } else {
      if (!tradeStorage[tradeID]) {
        tradeStorage[tradeID] = {};
      }
      tradeStorage[tradeID].locked = false;
    }
    if (lockTradeID[tradeID]) {
      continue;
    } else {
      if (
        !tradeStorage[tradeID] ||
        tradeStorage[tradeID].timestamp !== timestamp
      ) {
        const notificationType = {
          4482: "Items added to your trade",
          4413: "Trade Declined",
          4431: "Trade Accepted",
          4411: "Trade Cancelled (Other)",
          4420: "Trade Expired",
        }[log];
        if (notificationType) {
          const userData = await fetchUserData(apiKey, data.user);
          const embed = new MessageEmbed()
            .setTitle(`Trade with: ${userData.name}`)
            .setColor("#0099ff")
            .setFields(
              { name: "Trade ID", value: `${tradeID}`, inline: true },
              {
                name: "Status",
                value: `${userData.status.description}`,
                inline: true,
              },
              {
                name: "Last Action",
                value: `${userData.last_action.relative}`,
                inline: true,
              },
              { name: "Friends", value: `${userData.friends}`, inline: true },
              { name: "Enemies", value: `${userData.enemies}`, inline: true },
              {
                name: "Faction",
                value: userData.faction
                  ? userData.faction.faction_name
                  : "None",
                inline: true,
              },
            )
            .setDescription(`${notificationType}`)
            .setThumbnail(userData.profile_image)
            .setTimestamp(timestamp * 1000)
            .setFooter({
              text: "Trade Status Updated",
              iconURL: client.user.displayAvatarURL(),
            });
          const row = new MessageActionRow().addComponents(
            new MessageButton()
              .setStyle("LINK")
              .setURL(`https://www.torn.com/trade.php#step=view&ID=${tradeID}`)
              .setLabel("View Trade"),
            new MessageButton()
              .setStyle("LINK")
              .setURL(
                `https://www.torn.com/profiles.php?XID=${userData.player_id}`,
              )
              .setLabel("View Profile"),
            new MessageButton()
              .setStyle("DANGER")
              .setCustomId("delete_message")
              .setLabel("DELETE"),
          );
          try {
            await user.createDM();
            if (tradeStorage[tradeID] && tradeStorage[tradeID].messageID) {
              const dmChannel = await client.channels.fetch(
                tradeStorage[tradeID].dmChannelID,
              );
              const message = await dmChannel.messages.fetch(
                tradeStorage[tradeID].messageID,
              );
              await message.edit({ embeds: [embed], components: [row] });
            } else {
              const message = await user.send({
                embeds: [embed],
                components: [row],
              });
              console.log(
                `Updated trade notification for trade ID ${tradeID} for user ${userID}.`,
              ); // Logging for updated trade
              tradeStorage[tradeID] = {
                messageID: message.id,
                dmChannelID: message.channel.id,
                timestamp: timestamp,
                locked: false,
              };
              console.log(
                `Sent new trade notification for trade ID ${tradeID} for user ${userID}.`,
              ); // Logging for new trade
            }
            tradeStorage[tradeID].locked = true;
          } catch (error) {
            console.error(`Error sending DM: ${error}`);
            continue;
          }
        }
      }
    }
  }
  await client.db.set("tradeStorage", tradeStorage);
};

const fs = require("node:fs")
const Database = require("@replit/database")
const db = new Database()
db.set("userApiKeys", JSON.parse(fs.readFileSync("./userApiKeys.json", "utf-8")))
db.set("tradeStorage", JSON.parse(fs.readFileSync("./tradeStorage.json", "utf-8")))
db.set("subscriptionTokens", JSON.parse(fs.readFileSync("./subscriptionTokens.json", "utf-8")))

db.list().then(keys => {
  console.log(keys)
})
const crypto = require("crypto");

const algorithm = "aes256";

const cipher = crypto.createCipheriv(algorithm, process.env["secret_key"]);
const encrypted = cipher.update(text, "utf-8", "hex") + cipher.final("hex");
const decipher = crypto.createDecipheriv(algorithm, process.env["secret_key"]);
const decrypted =
  decipher.update(encrypted, "hex", "utf-8") + decipher.final("utf-8");

const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");

async function saveImage(sock, msg) {
  try {
    const buffer = await downloadMediaMessage(msg, "buffer", {}, { reuploadRequest: sock.updateMediaMessage });
    const filename = `${Date.now()}.jpg`;
    const filepath = path.join(__dirname, "..", "media", filename);
    
    fs.writeFileSync(filepath, buffer);
    console.log(`Image saved: ${filename}`);
    return { buffer, filename, filepath };
  } catch (err) {
    console.error("Error saving image:", err.message);
    return null;
  }
}

module.exports = saveImage;

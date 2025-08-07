const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");

async function startBot(socket, number) {
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: number }),
    puppeteer: { headless: true }
  });

  client.on("qr", async (qr) => {
    const qrImage = await qrcode.toDataURL(qr);
    socket.emit("qr", { qr: qrImage, number });
  });

  client.on("ready", async () => {
    const key = Math.random().toString(36).substring(2, 10).toUpperCase();
    console.log(`Bot ready for ${number}`);
    const chatId = number.replace("+", "") + "@c.us";
    await client.sendMessage(chatId, `✅ Your bot is connected!\n🔑 Your key: *${key}*\nKeep it safe.`);
    socket.emit("connected", { number, key });
  });

  client.on("auth_failure", () => {
    socket.emit("auth_failure", { number });
  });

  client.initialize();
}

module.exports = { startBot };

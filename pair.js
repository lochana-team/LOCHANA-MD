const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
let router = express.Router();
const pino = require("pino");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  delay,
  makeCacheableSignalKeyStore,
  Browsers,
  jidNormalizedUser,
} = require("@whiskeysockets/baileys");
const { upload } = require("./mega");

function removeFile(FilePath) {
  if (!fs.existsSync(FilePath)) return false;
  fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get("/", async (req, res) => {
  let num = req.query.number;
  async function LochanaaPair() {
    const { state, saveCreds } = await useMultiFileAuthState(`./session`);
    try {
      let LochanaaPairWeb = makeWASocket({
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(
            state.keys,
            pino({ level: "fatal" }).child({ level: "fatal" })
          ),
        },
        printQRInTerminal: false,
        logger: pino({ level: "fatal" }).child({ level: "fatal" }),
        browser: Browsers.macOS("Safari"),
      });

      if (!LochanaaPairWeb.authState.creds.registered) {
        await delay(1500);
        num = num.replace(/[^0-9]/g, "");
        const code = await LochanaaPairWeb.requestPairingCode(num);
        if (!res.headersSent) {
          await res.send({ code });
        }
      }

      LochanaaPairWeb.ev.on("creds.update", saveCreds);
      LochanaaPairWeb.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect } = s;
        if (connection === "open") {
          try {
            await delay(10000);
            const sessionPrabath = fs.readFileSync("./session/creds.json");

            const auth_path = "./session/";
            const user_jid = jidNormalizedUser(RobinPairWeb.user.id);

            function randomMegaId(length = 6, numberLength = 4) {
              const characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
              let result = "";
              for (let i = 0; i < length; i++) {
                result += characters.charAt(
                  Math.floor(Math.random() * characters.length)
                );
              }
              const number = Math.floor(
                Math.random() * Math.pow(10, numberLength)
              );
              return `${result}${number}`;
            }

            const mega_url = await upload(
              fs.createReadStream(auth_path + "creds.json"),
              `${randomMegaId()}.json`
            );

            const string_session = mega_url.replace(
              "https://mega.nz/file/",
              ""
            );

            const sid = `╔════════════════════════════════════╗
💙⚡ LOCHANAA MD ⚡💙
╚════════════════════════════════════╝

✨ Welcome! ✨

Hello @user, 👋

LOCHANAA MD වෙත ඔබව හදවතින්ම සාදරයෙන් පිළිගන්නවා. 💙

✅ Your connection has been established successfully.

අපගේ සේවාව සමඟ දැන් ඔබ සුරක්ෂිතව සම්බන්ධ වී ඇති අතර, ඔබට වේගවත්, ස්ථාවර සහ Premium Experience එකක් ලබාදීමට අපි සැමවිටම කැපවී සිටිමු. ⚡

━━━━━━━━━━━━━━━━━━━━━━━

🌐 Our Website
🔗 https://lochanaa-md.netlify.app/

📢 WhatsApp Channel
🔗 https://whatsapp.com/channel/0029VbDkWrHEquiSjpC9a23O

━━━━━━━━━━━━━━━━━━━━━━━

💙 Thank You For Choosing LOCHANAA MD

«⚡ Stay Connected.
💙 Stay Updated.
✨ Enjoy The Experience.»

━━━━━━━━━━━━━━━━━━━━━━━

— LOCHANAA-MD TEAM 💙`;
            const mg = `*🙈Code එක කාටවත් දෙන්න එපා පැටියෝ💋*`;
            const dt = await LochanaaPairWeb.sendMessage(user_jid, {
              image: {
                url: "https://raw.githubusercontent.com/lochana-team/LOCHANA-MD-HELPER/refs/heads/main/file_0000000014807207bf5f10d98373e997.png",
              },
              caption: sid,
            });
            const msg = await LochanaaPairWeb.sendMessage(user_jid, {
              text: string_session,
            });
            const msg1 = await LochanaaPairWeb.sendMessage(user_jid, { text: mg });
          } catch (e) {
            exec("pm2 restart prabath");
          }

          await delay(100);
          return await removeFile("./session");
          process.exit(0);
        } else if (
          connection === "close" &&
          lastDisconnect &&
          lastDisconnect.error &&
          lastDisconnect.error.output.statusCode !== 401
        ) {
          await delay(10000);
          LochanaaPair();
        }
      });
    } catch (err) {
      exec("pm2 restart lochanaa-md");
      console.log("service restarted");
      LochanaaPair();
      await removeFile("./session");
      if (!res.headersSent) {
        await res.send({ code: "Service Unavailable" });
      }
    }
  }
  return await LochanaaPair();
});

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
  exec("pm2 restart lochanaa-md");
});

module.exports = router;

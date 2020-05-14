/* eslint-disable no-console */
require("dotenv").config(__dirname + "/.env");

const { client } = require(__dirname + "/client.js");
const Discord = require("discord.js");
const Guild = require("./guild/guild");
const router = require(__dirname + "/guild/router/router");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = process.env["PORT"] || 3001;
process.on("unhandledRejection", console.log);

require(__dirname + "/modules/verification.js");
require(__dirname + "/modules/moderation.js");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use("/webhook", router);

app.get("/", function (req, res) {
  res.redirect("https://www.autumnbot.net/");
});

app.listen(port);

async function setStatus() {
  await client.user
    .setPresence({
      activity: {
        name: client.guilds.cache.size + " servers | -news",
        type: "LISTENING",
      },
    })
    .then(() => console.log("Status Set"));
}

client.on("guildCreate", async function (guild) {
  // Update Cache and Database
  Guild.addGuild(guild.id);

  // Update Status
  setStatus();

  let welcome = new Discord.MessageEmbed()
    .setColor("#db583e")
    .setTitle("Thank you for inviting me to your server!")
    .setDescription(
      "Do `-help` for a list of commands\n\nGo to https://www.autumnbot.net/dashboard to set up the bot. Visit [this server](https://discord.gg/tbUuhB7) if you need any help."
    );

  let channelID;
  let channels = guild.channels.cache;
  channelLoop: for (let c of channels) {
    let channelType = c[1].type;
    if (channelType === "text") {
      channelID = c[0];
      break channelLoop;
    }
  }

  let channel = client.channels.cache.get(guild.systemChannelID || channelID);
  channel.send(welcome);
});

client.on("guildDelete", async function (guild) {
  Guild.deleteGuild(guild.id);
  setStatus();
});

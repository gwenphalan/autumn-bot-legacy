/* eslint-disable no-console */
const { client } = require(__dirname + "/client.js");
const Discord = require('discord.js');
const con = require(__dirname + '/db.js');
const verification = require(__dirname + "/modules/verification.js");
const moderation = require(__dirname + "/modules/moderation.js");

client.on("guildCreate", async function (guild) {
  await client.user.setPresence({
    activity: {
      name: client.guilds.cache.size + ' servers | -news',
      type: "LISTENING",
    }
  }).then(() => console.log('Status Set'));

  var sql = `INSERT INTO guildsettings (Guild, VerifyModule, ModModule, VerifyApps) VALUES ('${guild.id}', '{"enabled":false}', '{"enabled":false}', '{}')`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });

  let welcome = new Discord.MessageEmbed()
    .setColor('#db583e')
    .setTitle('Thank you for inviting me to your server!')
    .setDescription('Do `-help` for a list of commands\n\nGo to https://www.autumnbot.net/dashboard to set up the bot. Visit [this server](https://discord.gg/tbUuhB7) if you need any help.');

  let channelID;
  let channels = guild.channels.cache;
  channelLoop:
  for (let c of channels) {
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
  var sql = `DELETE FROM guildsettings WHERE Guild = '${guild.id}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });

  await client.user.setPresence({
    activity: {
      name: client.guilds.cache.size + ' servers | -news',
      type: "LISTENING",
    }
  }).then(() => console.log('Status Set'));
});
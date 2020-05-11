/* eslint-disable no-console */
const { client } = require(__dirname + "/client.js");
const Discord = require('discord.js');
const con = require(__dirname + '/db.js');
const { Guild, router } = require(__dirname + '/guild.js');
const bodyParser = require('body-parser');
const verification = require(__dirname + "/modules/verification.js");
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env['PORT'] || 3001;

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(router);

app.get('/',function(req, res){
  res.redirect('https://www.autumnbot.net/');
})

app.listen(port)

client.on("guildCreate", async function (guild) {
  await client.user.setPresence({
    activity: {
      name: client.guilds.cache.size + ' servers | -news',
      type: "LISTENING",
    }
  }).then(() => console.log('Status Set'));

  var guildInfo = new Guild(guild.id);

  guildInfo.cacheGuild();
  
  var sql = `INSERT INTO guildsettings (Guild, VerifyModule, ModModule, VerifyApps) VALUES ('${guild.id}', '{"enabled":false}', '{"enabled":false}', '{}')`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  }).then(() => {
    axios
        .post(`http://localhost:3000/guild`)
        .then(res => {
            console.log("RES: " + res.data)
        })
        .catch(error => {
            console.error(error)
        })
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
    axios
        .post(`http://localhost:3000/api/guild/update`)
        .then(res => {
            console.log("RES: " + res.data)
        })
        .catch(error => {
            console.error(error)
        })
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
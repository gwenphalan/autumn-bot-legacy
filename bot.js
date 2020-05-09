/* eslint-disable no-console */
const { client } = require(__dirname + "/client.js");
const Discord = require('discord.js');
const con = require(__dirname + '/db.js');
const { Guild, router } = require(__dirname + '/guild.js');
const bodyParser = require('body-parser');
const verification = require(__dirname + "/modules/verification.js");
const express = require('express');
const app = express();
const port = process.env['PORT'] || 3000;

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(router);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

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
  guild.owner.send(welcome);
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
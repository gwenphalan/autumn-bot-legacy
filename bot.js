/* eslint-disable no-console */
const { client } = require(__dirname + "/client.js");
const Discord = require('discord.js');
const con = require(__dirname + '/db.js');
const Guild = require(__dirname + '/guild.js');

client.on("guildCreate", async function (guild) {
  await client.user.setPresence({
    activity: {
      name: client.guilds.cache.size + ' servers | -news',
      type: "LISTENING",
    }
  }).then(() => console.log('Status Set'));

  var sql = `INSERT INTO guildsettings (Guild, VerifyModule, ModModule) VALUES ('${guild.id}', '{"enabled":false}', '{"enabled":false}')`;
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


client.on("channelCreate", async (channel) => {
  if (channel.guild) {
    let GuildOBJ = new Guild(channel.guild.id)

    let verifyModule = await GuildOBJ.verifyModule();

    if (verifyModule.enabled = true) {
      var nonVerifiedRole;

      await channel.guild.roles.fetch(verifyModule.NonVerifiedRole)
        .then(role => nonVerifiedRole = role)
        .catch(console.error);

      channel.overwritePermissions([
        {
           id: nonVerifiedRole,
           deny: ['VIEW_CHANNEL'],
        },
      ]);

    console.log(`\u001b[32mVerifyModule Log\u001B[37m -- \u001b[31mUpdated Channel \u001B[37m\n--------\n    Channel: \u001B[36m#${channel.name} \n\u001B[37m    ID: \u001B[34m${channel.id}\u001B[37m \n    Server \u001B[36m${GuildOBJ.info.name}\u001B[37m\n--------`);
    }
  }
});

client.on("guildMemberAdd", async (member) => {
  let GuildOBJ = new Guild(member.guild.id)

  var verifyModule = await GuildOBJ.verifyModule();

  console.log(verifyModule.NonVerifiedRole);

  if (verifyModule.enabled) {
    var nonVerifiedRole = verifyModule.NonVerifiedRole;

    member.roles.add(nonVerifiedRole);

    console.log(`\u001B[32mVerifyModule\u001B[37m: Updated User For \u001B[36m@${member.username}${member.tag}\u001B[37m(ID: \u001B[34m${channel.id}\u001B[37m) for server \u001B[36m${GuildOBJ.info.name}`);
  }
})

client.on("message", async (message) => {
  if (message.guild) {
    var setup = new Discord.MessageEmbed()
      .setColor('#db583e')
      .setTitle("Oh No!")
      .setAuthor('Autumn Bot Verification', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.webp?size=256')
      .setDescription(`This server isn't set up with the new verification dashboard yet! Contact ${message.guild.owner.toString()} and tell them to set up the Verification Module here: https://www.autumnbot.net/dashboard`)
      .setTimestamp();

    const GuildOBJ = new Guild(message.guild.id);

    let verifyModule = await GuildOBJ.verifyModule();

    console.log("Verify Module: " + verifyModule);

    if (verifyModule.enabled) {

      var msgChannel = message.channel.id;
      var author = message.author;
      var member = message.member;
      var guild = message.guild;

      var userDM = client.users.cache.get(author.id);

      console.log(userDM);

      var VerifyChannel;

      await client.channels.fetch(verifyModule.VerifyChannel)
        .then(channel => VerifyChannel = channel)
        .catch(console.error);

      var ModVerifyChannel;

      await client.channels.fetch(verifyModule.MVChannel)
        .then(channel => ModVerifyChannel = channel)
        .catch(console.error);

      var StaffRole = verifyModule.StaffRole;
      var NonVerifiedRole = verifyModule.NonVerifiedRole;

      var VerifyMessage = verifyModule.VMessage;

      if (verifyModule.AVRole && msgChannel == VerifyChannel && !message.author.bot) {
        message.channel.send(setup);
      }

      if (msgChannel != verifyModule.VerifyChannel || author.bot || !message.member.roles.cache.has(NonVerifiedRole)) return;
      if (message.member.roles.cache.has(StaffRole)) return;

      const accept = client.emojis.cache.get('673092790074474527');
      const deny = client.emojis.cache.get('673092807614791690');

      var app = new Discord.MessageEmbed()
        .setColor('#b5b5b5')
        .setTitle("Awaiting Verification")
        .setAuthor(author.tag, author.avatarURL())
        .setDescription(message.content)
        .setTimestamp();

      function createEmbed(color, title, authorName, authorIcon, Desc)
      {
        return new Discord.MessageEmbed()
          .setColor(color)
          .setTitle(title)
          .setAuthor(authorName, authorIcon)
          .setDescription(Desc)
          .setTimestamp()
      }

      var acceptdm = createEmbed('#52eb6c', 'Verification Application', guild.name, guild.iconURL(), VerifyMessage);
      var denydm = createEmbed('#d94a4a', 'Verification Application', guild.name, guild.iconURL(), `You have been denied for verification! Submit another application at <#${verifyModule.VerifyChannel}>`);
      var awaitdm = createEmbed('#db583e', 'Verification Application', guild.name, guild.iconURL(), `Your verification application has been submitted for reviewal in \`${guild.name}\``);
      var accepted = createEmbed('#52eb6c', 'Accepted', author.tag, author.avatarURL(), `${message.content}`);
      var denied = createEmbed('#d94a4a', 'Denied', author.tag, author.avatarURL(), `${message.content}`);

      VerifyChannel.updateOverwrite(author, { VIEW_CHANNEL: false });

      message.delete();

      var msg;

      await ModVerifyChannel.send(app)
        .then(message => msg = message)

      await msg.channel.send(`<@&${StaffRole}>`)
        .catch(console.error)
        .then(message => message.delete());

      msg.react(accept).then(() =>
        msg.react(deny)
      );

      author.send(awaitdm);

      const filter = (reaction, user) => {
        return reaction.emoji.id == "673092790074474527" && !user.bot || reaction.emoji.id == "673092807614791690" && !user.bot;
      }

      var collected;
      await msg.awaitReactions(filter, { max: 1 })
        .then(collectedReactions => collected = collectedReactions);

      const reaction = collected.first();

      console.log(collected);


      if (reaction.emoji.id == "673092790074474527") {
        VerifyChannel.updateOverwrite(author, { VIEW_CHANNEL: null })
          .catch(console.error);
        member.roles.remove(NonVerifiedRole)

        msg.edit(accepted)
          .catch(console.error);
        msg.reactions.removeAll();

        console.log(member)

        author.send(acceptdm);
      } else {
        VerifyChannel.updateOverwrite(author, { VIEW_CHANNEL: null })
          .catch(console.error);

        msg.edit(denied)
          .catch(console.error);
        msg.reactions.removeAll();

        author.send(denydm);
      }
    }
  }
}
);
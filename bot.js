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

  var sql = `INSERT INTO guildsettings (Guild, VerifyModule) VALUES ('${guild.id}', '{"enabled":false}')`;
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

    if (verifyModule.enabled == true) {
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

    console.log(`VerifyModule Log -- Updated Channel\n--------\n    Channel: m#${channel.name}\n    ID: ${channel.id}\n    Server ${GuildOBJ.info.name}\n--------`);
    }
  }
});

client.on("guildMemberAdd", async (member) => {
  let GuildOBJ = new Guild(member.guild.id)

  var verifyModule = await GuildOBJ.verifyModule();

  if (verifyModule.enabled) {
    var nonVerifiedRole = verifyModule.NonVerifiedRole;

    member.roles.add(nonVerifiedRole, "New User");
  }
})

client.on("message", async (message) => {
  if (message.guild) {
    var setup = new Discord.MessageEmbed()
      .setColor('#db583e')
      .setTitle("Oh No!")
      .setAuthor('Autumn Bot Verification', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.webp?size=256')
      .setDescription(`This server isn't set up with the new verification dashboard yet! Contact ${message.guild.owner} and tell them to set up the Verification Module here: https://www.autumnbot.net/dashboard`)
      .setTimestamp();

    const GuildOBJ = new Guild(message.guild.id);

    let verifyModule = await GuildOBJ.verifyModule();

    if(verifyModule == null)
    {
      var sql = `INSERT INTO guildsettings (Guild, VerifyModule) VALUES ('${message.guild.id}', '{"enabled":false}')`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });

      return;
    }

    if (verifyModule.enabled) {

      var msgChannel = message.channel.id;
      var author = message.author;
      var member = message.member;
      var guild = message.guild;

      var userDM = client.users.cache.get(author.id);

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
      var VerifiedRole = verifyModule.VerifyRole;

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
        .setAuthor("Verification", "https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=128")
        .setTitle(author.tag)
        .setThumbnail(author.displayAvatarURL().replace('webp','png'))
        .setFooter(`Awaiting Verification By Staff`)
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

      function createApp(color, authorName, authorIcon, Desc, Footer, staffIcon)
      {
        return new Discord.MessageEmbed()
          .setColor(color)
          .setTitle(authorName)
          .setAuthor("Verification", "https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=128")
          .setThumbnail(authorIcon)
          .setDescription(Desc)
          .setFooter(Footer, staffIcon)
          .setTimestamp()
      }

      var acceptdm = createEmbed('#52eb6c', guild.name, guild.iconURL(), VerifyMessage);
      var denydm = createEmbed('#d94a4a', 'Verification Application', guild.name, guild.iconURL(), `You have been denied for verification! Submit another application at <#${verifyModule.VerifyChannel}>`);
      var awaitdm = createEmbed('#db583e', 'Verification Application', guild.name, guild.iconURL(), `Your verification application has been submitted for reviewal in \`${guild.name}\``);

      VerifyChannel.updateOverwrite(author, { VIEW_CHANNEL: false }, "User Awaiting Verification");

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

      var reaction_user = reaction.users.cache.array()[1];

      var accepted = createApp('#52eb6c', author.tag, author.displayAvatarURL().replace('webp','png'), `${message.content}`, `Accepted By ${reaction_user.username}#${reaction_user.discriminator}`, reaction_user.displayAvatarURL().replace('webp','png'));
      var denied = createApp('#d94a4a', author.tag, author.displayAvatarURL().replace('webp','png'), `${message.content}`, `Denied By ${reaction_user.username}#${reaction_user.discriminator}`, reaction_user.displayAvatarURL().replace('webp','png'));

      if (reaction.emoji.id == "673092790074474527") {
        VerifyChannel.updateOverwrite(author, { VIEW_CHANNEL: null })
          .catch(console.error);
        member.roles.remove(NonVerifiedRole, `Verification Application Approved By ${reaction_user.username}#${reaction_user.discriminator}`)

        if(verifyModule.VerifiedRoleEnabled)
        {
          member.roles.add(verifyModule.VerifiedRole, `Verification Application Approved By ${reaction_user.username}#${reaction_user.discriminator}`);
        }

        msg.edit(accepted)
          .catch(console.error);
        msg.reactions.removeAll();


        author.send(acceptdm);
      } else {
        VerifyChannel.updateOverwrite(author, { VIEW_CHANNEL: null }, `Verification Application Denied By ${reaction_user.username}#${reaction_user.discriminator}`)
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
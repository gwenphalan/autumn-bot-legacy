/* eslint-disable no-console */
const commando = require('discord.js-commando');
const Discord = require('discord.js')
const path = require('path');
const oneLine = require('common-tags').oneLine;
const mysql = require('mysql');
const sqlite = require('sqlite');
const token = 'NjcyNTQ4NDM3MzQ2MjIyMTEw.XjNG_w.ktL1L5yv_TPvTOlIHjgyBZXXL5k';
const apiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjU0ODQzNzM0NjIyMjExMCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTgyNTk3MzQ3fQ.AOFlwDk84YGZBAdcRHSnmNYB05adjih6GRWONTR4VJk';

var con = mysql.createConnection({
  host: "webserver3.pebblehost.com",
  user: "autumnfo_admin",
  password: "9p4kd%DkOw96",
  database: "autumnfo_discordbot"
});
const client = new commando.Client({
  owner: '279910519467671554',
  commandPrefix: '-',
  invite: 'https://discord.gg/DfByvyN',
  unknownCommandResponse: false
});

async function getGuildInfo(id)
{
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM guildsettings WHERE Guild = '" + id + "' LIMIT 1", 
      (err, result) => {
        return err ? reject(err) : resolve(result);
      })
  })
}

async function getAllGuilds()
{
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM guildsettings", 
      (err, result) => {
        return err ? reject(err) : resolve(result);
      })
  })
}

let guild = [];

con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM guildsettings", function (err, result) {
      if (err) throw err;
      guild = result;
    });
});


/*client.on("ready", async function(){
  let guilds = await getAllGuilds();

  let repeats = [];
  for(var i = 0; i < guilds.length; i++){
    let currGuild = client.guilds.get(guilds[i].Guild);

    let guild = await getGuilds(currGuild.id);

    
    if(guild.length > 1){
      for(var a = 0; a < guild.length-1; a++)
      { 
  
        console.log(a+1);
        var curGuild = guild[a+1];

        var repeatsFilter = repeats.filter(function(repeat){
          return repeat == curGuild.VerifyChannel
        })
  
        if(repeatsFilter[0]){
          console.log(curGuild.VerifyChannel + " has already been logged!")
        }else{
          repeats.push(curGuild.VerifyChannel);
          console.log(curGuild.VerifyChannel + " has been logged!")
        }
      }
    }
  }
  for(var i = 0; i < repeats.length; i++){
    var sql = `DELETE FROM guildsettings WHERE VerifyChannel = '${repeats[i]}'`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(repeats[i] + " HAS BEEN DELETED!");
    });
  }
});*/

/*
client.on("ready", async function(){
  let guilds = await getAllGuilds();

  console.log(guilds);

  for(var i = 0; i < guilds.length; i++){
    

    var VerifyChannel = guilds[i].VerifyChannel;
    var AVChannel = guilds[i].AVChannel;
    var MVChannel = guilds[i].MemberRole;
    var StaffRole = guilds[i].StaffRole;
    var MemberRole = guilds[i].MemberRole;
    var AVRole = guilds[i].AVRole;
    var VMessage = guilds[i].VMessage;


    

    var VerifyModule = {
      VerifyChannel: VerifyChannel,
      AVChannel: AVChannel,
      MVChannel: MVChannel,
      StaffRole: StaffRole,
      MemberRole: MemberRole,
      AVRole: AVRole,
      VMessage: VMessage,
    }

    var final = JSON.stringify(VerifyModule);

    var a = 0;
    var count = 0;
    for(a = 0; a < JSON.stringify(VerifyModule).length; a++)
    {
        if(JSON.stringify(VerifyModule).charAt(a) == "'")
        {
            final = [final.slice(0, a+count), '\\', final.slice(a+count)].join('');
            count++;

        }
    }

    console.log(final);
    var sql = "UPDATE guildsettings SET VerifyModule = '" + final + "' WHERE Guild = \"" + guilds[i].Guild + "\"";

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    });
  }
});*/

client.on("guildCreate", async function(guild) {
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
  .setDescription('Do `-help` for a list of commands.\n\nFor information on setting up the verification function, do `-info`.\n\nIf you need any support, visit [this server](https://discord.gg/tbUuhB7).');
  guild.owner.send(welcome);
});

client.on("guildDelete", async function(guild){
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
})

/*
client.on("channelCreate", async (channel) => {
  if(channel.guild){

    let id = channel.guild.id;
  
    let guildSettings = await getGuildInfo(id);
  
    if(guildSettings[0] == undefined)
    {
      return;
    };
  
    
    let mRole;
    await channel.guild.roles.fetch(guildSettings[0].VerfiyModule).then(() => {
      mRole = 
    });
  
    channel.overwritePermissions(channel.guild.defaultRole.id, {
      VIEW_CHANNEL: false
    });
  
    channel.overwritePermissions(mRole, {
      VIEW_CHANNEL: true
    });
  }
});*/

function getAttachment(msg){
  try{
    return msg.attachments.first().proxyURL;
  }
  catch{
    console.error;
    return 'No Attachments'
  }
}

/*
client.on('message', msg => 
{

  var attachments = msg.attachments.first();

  const errorImage = new Discord.RichEmbed()
    .setColor('#ff6666')
    .setDescription('Your submission did not have an image!')
    .setTitle('SUBMISSION ERROR');

    const errorContent = new Discord.RichEmbed()
      .setColor('#ff6666')
      .setDescription('Your submission did not have a description!')
      .setTitle('SUBMISSION ERROR');//

      if(msg.channel.id == '674369829179752482' && !msg.author.bot /*|| msg.channel.id == '673092933695832084' && !msg.author.bot)
      {
        //msg.channel.send('URL: ' + getAttachment(msg));
        if(attachments == undefined){
          msg.author.send(errorImage);
          msg.delete();
          return;
        }

        if(msg.content == undefined){
          msg.author.send(errorContent);
          msg.delete();
          return;
        }

        var img = getAttachment(msg);
        var submission = new Discord.RichEmbed()
          .setColor('#faff66')
          .setTitle('Submission')
          .setAuthor(msg.author.tag, msg.author.avatarURL())
          .setDescription(msg.content)
          .setImage(img)
  
          client.channels.fetch('674369842375295016').send(submission)
          .then(function(msg){
            msg.react(client.emojis.get('674382678312615955'))
          });
          msg.delete(500);
          msg.member.roles.add('674368716284100634');
          return;
      }
})*/

client.on("ready", () => {
  console.log("Loading...");
  let interval = setInterval(() => {
    if (typeof database !== "object" || typeof guilds !== "object") return;
    console.log("I'm online!");
    clearInterval(interval);
  }, 100);
});

client
  .on('error', console.error)
  .on('warn', console.warn)
  .on('debug', console.log)
  .on('ready', async function(){
    client.user.setStatus('available')
    await client.user.setPresence({
        activity: {
            name: client.guilds.cache.size + ' servers | -news',
            type: "LISTENING",
        }
    }).then(() => console.log('Status Set'));
    console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
  })
  .on('disconnect', () => { console.warn('Disconnected!'); })
  .on('reconnecting', () => { console.warn('Reconnecting...'); })
  .on('commandError', (cmd, err) => {
    if (err instanceof commando.FriendlyError) return;
    console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
  })
  .on('commandBlocked', (msg, reason) => {
    console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
  })
  .on('commandPrefixChange', (guild, prefix) => {
    console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('commandStatusChange', (guild, command, enabled) => {
    console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('groupStatusChange', (guild, group, enabled) => {
    console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  });

function escapeSpecialChars(jsonString) {
  return jsonString
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\f/g, "\\f");

}

client.setProvider(
  sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new commando.SQLiteProvider(db))
).catch(console.error);

client.on("guildMemberAdd", async (member) =>{
  let currGuild = await getGuildInfo(member.guild.id);

  let verifyModuleJSON = currGuild[0].VerifyModule;

  var verifyModule = JSON.parse(escapeSpecialChars(verifyModuleJSON));

  console.log(verifyModule.NonVerifiedRole);

  if(verifyModule.enabled){
    var nonVerifiedRole = verifyModule.NonVerifiedRole;

    member.roles.add(nonVerifiedRole);
  }
})

client.on("message", async (message) => {
  if(message.guild)
  {
    var setup = new Discord.MessageEmbed()
    .setColor('#db583e')
    .setTitle("Oh No!")
    .setAuthor('Autumn Bot Verification', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.webp?size=256')
    .setDescription(`This server isn't set up with the new verification dashboard yet! Contact ${message.guild.owner.toString()} and tell them to set up the Verification Module here: https://www.autumnbot.net/dashboard`)
    .setTimestamp();

    //Testing in server
    
    let currGuild = await getGuildInfo(message.guild.id);

    if(!currGuild[0]){
      var sql = `INSERT INTO guildsettings (Guild, VerifyModule) VALUES ('${message.guild.id}', '{"enabled":false}')`;
      con.query(sql, function (err, result) {
      if (err) throw err;
            console.log("1 record inserted");
      });
    };

    let verifyModuleJSON = currGuild[0].VerifyModule;
  
    var verifyModule = JSON.parse(escapeSpecialChars(verifyModuleJSON));

    if(verifyModule.enabled){

      var msgChannel = message.channel.id;
      var author = message.author;
      var member = message.member;
      var guild = message.guild;

      var userDM = client.users.cache.get(author.id);
      
      console.log(userDM);

      //Declare Beforehand, and then set during .then()

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

      if(verifyModule.AVRole && msgChannel == VerifyChannel && !message.author.bot){
        message.channel.send(setup);
      }

      if(msgChannel != verifyModule.VerifyChannel || author.bot || !message.member.roles.cache.has(NonVerifiedRole)) return;
      if(message.member.roles.cache.has(StaffRole)) return;

      const accept = client.emojis.cache.get('673092790074474527');
      const deny = client.emojis.cache.get('673092807614791690');

      var app = new Discord.MessageEmbed()
      .setColor('#b5b5b5')
      .setTitle("Awaiting Verification")
      .setAuthor(author.tag, author.avatarURL())
      .setDescription(message.content)
      .setTimestamp();

      var acceptdm = new Discord.MessageEmbed()
      .setColor('#52eb6c')
      .setTitle("Verification Application")
      .setAuthor(guild.name, guild.iconURL())
      .setDescription(VerifyMessage)
      .setTimestamp()

      var denydm = new Discord.MessageEmbed()
      .setColor('#d94a4a')
      .setTitle("Verification Application")
      .setAuthor(guild.name, guild.iconURL())
      .setDescription(`You have been denied for verification! Submit another application at <#${verifyModule.VerifyChannel}>`)
      .setTimestamp()

      var awaitdm = new Discord.MessageEmbed()
      .setColor('#db583e')
      .setTitle("Verification Application")
      .setAuthor(guild.name, guild.iconURL())
      .setDescription(`Your verification application has been submitted for reviewal in \`${guild.name}\``)
      .setTimestamp()

      var accepted = new Discord.MessageEmbed()
      .setColor('#52eb6c')
      .setTitle("Accepted")
      .setAuthor(author.tag, author.avatarURL())
      .setDescription(`${message.content}`)
      .setTimestamp()

      var denied = new Discord.MessageEmbed()
      .setColor('#d94a4a')
      .setTitle("Denied")
      .setAuthor(author.tag, author.avatarURL())
      .setDescription(`${message.content}`)
      .setTimestamp()

      VerifyChannel.updateOverwrite(author, {VIEW_CHANNEL: false});

      message.delete();
      
      var msg;

      await ModVerifyChannel.send(app)
      .then( message => msg = message)
      
      var ping;

      await msg.channel.send(`<@&${StaffRole}>`)
      .catch(console.error)
      .then(message => ping = message);

      ping.delete();

      msg.react(accept).then( () =>
        msg.react(deny)
        );

      author.send(awaitdm);

      const filter = (reaction, user) => {
        return reaction.emoji.id == "673092790074474527" && !user.bot || reaction.emoji.id == "673092807614791690" && !user.bot ;
      }

      var collected;
      await msg.awaitReactions(filter, {max: 1})
        .then(collectedReactions => collected = collectedReactions);

      const reaction = collected.first();

      console.log(collected);


      if(reaction.emoji.id == "673092790074474527"){
        VerifyChannel.updateOverwrite(author, {VIEW_CHANNEL: null})
        .catch(console.error);
        member.roles.remove(NonVerifiedRole)
        
        msg.edit(accepted)
        .catch(console.error);

        msg.reactions.removeAll();

        console.log(member)


        author.send(acceptdm);
      } else {
        VerifyChannel.updateOverwrite(author, {VIEW_CHANNEL: true})
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




client.registry
  .registerGroup('mod', 'Mod')
  .registerGroup('fun', 'Fun')
  .registerDefaultGroups()
  .registerDefaultTypes()
  .registerDefaultCommands({ help: false, eval: false })
  .registerTypesIn(path.join(__dirname, 'types'))
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(token);

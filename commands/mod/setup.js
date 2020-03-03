const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const mysql = require('mysql');
const Discord = require('discord.js')

var con = mysql.createConnection({
  host: "webserver3.pebblehost.com",
  user: "autumnfo_admin",
  password: "9p4kd%DkOw96",
  database: "autumnfo_discordbot"
});

const client = new commando.Client({
    owner: '279910519467671554',
    commandPrefix: '-',
    unknownCommandResponse: false
});

con.connect(function(error){
    if(!!error){
      console.log(error);
    }else{
      console.log('%cMySQL Connection Established', 'color: green');
    }
});

  
let guilds = [];

con.query("SELECT * FROM guildsettings", function (err, result) {
    if (err) throw err;
    guilds = result;
});


module.exports = class ClassName extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'setup',
            aliases: [],
            group: 'mod',
            memberName: 'setup',
            description: 'Sets up the server for use with Autumn Bot.',
            details: oneLine`
            Sets up the server for use with Autumn Bot.
            `,
            examples: ['-setup']
        })
    }
    async getGuildInfo(id)
{
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM guildsettings WHERE Guild = '" + id + "' LIMIT 1", 
      (err, result) => {
        return err ? reject(err) : resolve(result);
      })
  })
}
    createAV(g){
        return g.createRole({
            name: "Awaiting Verification",
            color: "#700e0f",
            mentionable: true
        })
        .then(role => role.id)
    }

    createStaff(g){
        return g.createRole({
            name: "Staff",
            color: "#7c7c7c",
            mentionable: true
        })
        .then(role => role.id)
    }

    createMember(g, role){
        return g.createRole({
            name: "Member",
            mentionable: true
        })
        .then(role => role.id)
    } 

    createVChan(g, role1, role2, role3){
        return g.createChannel('verify', {
            type: "text",
            permissionOverwrites: [{
                id: role1,
                deny: ['VIEW_CHANNEL']
            },
            {
                id: role2,
                deny: ['VIEW_CHANNEL']
            },
            {
                id: role3,
                allow: ['VIEW_CHANNEL'],
                deny: ['ADD_REACTIONS']
            }]
        })
        .then(channel => channel.id)
    }    
    
    createAVChan(g, role1, role2, role3){
        return g.createChannel('awaiting-verification', {
            type: "text",
            permissionOverwrites: [{
                id: role1,
                deny: ['VIEW_CHANNEL']
            },
            {
                id: role2,
                allow: ['VIEW_CHANNEL'],
                deny: ['SEND_MESSAGES', 'ADD_REACTIONS']
            },
            {
                id: role3,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                deny: ['ADD_REACTIONS']
            }]
        })
        .then(channel => channel.id)
    }

    createMVChan(g, role1, role2){
        return g.createChannel('mod-verify', {
            type: "text",
            permissionOverwrites: [{
                id: role1,
                deny: ['VIEW_CHANNEL']
            },
            {
                id: role2,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                deny: ['ADD_REACTIONS']
            }]
        })
        .then(channel => channel.id)
    }

    async run(msg) {

        msg.channel.send("**The `-setup` command has been removed!** Go to https://www.autumnbot.net/dashboard to setup the Verification Module.")

        /*
        if (!msg.member.hasPermission('ADMINISTRATOR') && msg.author.id != "279910519467671554"){
            msg.reply("You don't have the `ADMINISTRATOR` permission!").then(function (msg) { 
                msg.delete(10000)
            });
            msg.delete();
            return;
        };
  
        let currGuild = await this.getGuildInfo(msg.guild.id);

        //let table = await client.loadTable("guildsettings");
        if(currGuild[0] != undefined){
            msg.channel.send("You have already set up your server!\n\nIf you would like to change a setting, do `-settings` to change the settings.").then(function (msg) { 
                msg.delete(10000)
            });
            msg.delete();
            return;
        };

        //const accept = client.emojis.get('673092790074474527');
        //const deny = client.emojis.get('673092807614791690');

        const accept = '673092790074474527';
        const deny = '673092807614791690';

        const verifyE = new Discord.RichEmbed()
            .setAuthor('Verification Setup', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.webp?size=256')
            .setDescription('**WARNING** Setting up the server will create new channels, roles, and edit permissions for all channels in your server. \nReact with <:Accept:673092790074474527> to continue the process. React with <:Accept:673092790074474527> to cancel the process.')
            .addField('<:Blank:680820567930175538>', '**Channels**', true)
            .addBlankField(true)
            .addBlankField(true)
            .addField('<:icon_red:680816713864183877> `#verify`', 'Channel where non-verified users send their application for verification,', true)
            .addField('<:icon_red:680816713864183877> `#awaiting-verification`', 'Channel where users are sent when awaiting verification. You can send a message explaining the verification process and what is going on.', true)
            .addField('<:icon_red:680816713864183877> `#mod-verify`', 'Channel where staff members can accept/deny verification applications.', true)
            .addField('<:Blank:680820567930175538>', '**Roles**', true)
            .addBlankField(true)
            .addBlankField(true)
            .addField('<:icon_red:680816713864183877> `@Member`', 'Role given to verified users. @Member gains access to all channels except the 3 new channels.', true)
            .addField('<:icon_red:680816713864183877> `@Awaiting Verification`', 'Given to users awaiting verification. Users gain access to #awaiting-verification', true)
            .addField('<:icon_red:680816713864183877> `@Staff`', 'Channel where staff members can accept/deny verification applications.', true)
            .setColor('#db583e')

        const verifyEa = new Discord.RichEmbed()
            .setTitle('Setup Started...')
            .setColor('#db583e')

        const verifyEb = new Discord.RichEmbed()
            .setTitle('Setup Cancelled.')
            .setColor('#db583e')
        
        msg.channel.send(verifyE)
        .then(msg1 => {
          msg1.react(accept).then( () =>
          {
            msg1.react(deny);
            console.log("Booty");
          });
  
          const filter = (reaction, user) => {
            return [accept, deny].includes(reaction.emoji.id) && !user.bot;
          }
  
          msg1.awaitReactions(filter, {max: 1})
            .then(async (collected) =>  {
              const reaction = collected.first();
              console.log("awaiting emojis");
  
              if(reaction.emoji.id === accept){
                msg1.edit(verifyEa);
                msg1.clearReactions();
                let finished =  new Discord.RichEmbed()
                .setTitle('Setup Complete')
                .setColor('#db583e');
                let g = msg.guild;
                let staff = '';
                let member = '';
                let avrole = '';
        
                let guild = g.id;
                let everyone = g.defaultRole.id;
        
                let verify = '';
                let avchan = '';
                let mvchan = '';
                avrole = await this.createAV(g);
                console.log(avrole);
                
                verifier = await this.createStaff(g);
                
                nonverified = await this.createMember(g);
                
                /*
                 *Update current channels permissions.
                 
        
                const channels = msg.guild.channels.array();
        
                //console.log(channels);
                var i = 0;
                for(i = 0; i < channels.length; i++){
                    const channel = msg.guild.channels.get(channels[i].id);
        
                    channel.overwritePermissions(msg.guild.defaultRole.id, {
                      VIEW_CHANNEL: false
                    });
            
                    channel.overwritePermissions(member, {
                      VIEW_CHANNEL: true
                    });
                }
        
                verify = await this.createVChan(g, avrole, member, staff);
                console.log(verify);
        
                avchan = await this.createAVChan(g, everyone, avrole, staff);
                console.log(avchan);
        
                mvchan = await this.createMVChan(g, everyone, staff);
                console.log(mvchan);
                
                var verifyModule = {
                    enabled: false,
                    VerifyChannel: verify,
                    MVChannel: mvchan,
                    StaffRole: staff,
                    NonVerifiedRole: nonverified,
                    VMessage: 'You have been verified!',
                }
                
                var verifyModuleJSON = JSON.stringify(verifyModule);
                
                var sql = `INSERT INTO guildsettings (Guild, VerifyModule) VALUES ('${guild}', '${verifyModuleJSON}')`;
                con.query(sql, function (err, result) {
                if (err) throw err;
                      console.log("1 record inserted");
                });
                
                msg1.edit(finished);
                
                //await table.add(['663123931137310770', "-", '672990046051106846', '663243697957240853', '663136203830329355', '672990044880896020', '672990047015927819', '672990048236339231', "You have been verified!"]);
        
                console.log(`NEW DATABASE ENTRY\n--------------------\nGuild: ${guild}\nVerify: ${verify}\nStaff: ${staff}\n Member: ${member}\nAVRole: ${avrole}\nAVChan: ${avchan}\nMVChan: ${mvchan}\nVMessage: "You have been verified!"`)
              } else {
                msg1.clearReactions();
                msg1.edit(verifyEb);
                return;
              }
            })
        })*/
    }
}
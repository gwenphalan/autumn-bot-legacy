const commando = require('discord.js-commando');
const Discord = require('discord.js');
const oneLine = require('common-tags').oneLine;
const mysql = require("mysql");

var con = mysql.createConnection({
  host: "webserver3.pebblehost.com",
  user: "autumnfo_admin",
  password: "9p4kd%DkOw96",
  database: "autumnfo_discordbot"
});

let guilds = [];

con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM guildsettings", function (err, result) {
      if (err) throw err;
      guilds = result;
    });
});

module.exports = class ClassName extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'settings',
            aliases: [],
            group: 'mod',
            memberName: 'settings',
            description: 'Sends an embeded message to the chosen channel.',
            details: oneLine`
                description
            `,
            examples: ["-embed #channel 'Title' 'This is the embeds description.' '#24fc03'"],

            args: [
                {
                    key: 'setting',
                    prompt: 'What setting would you like to view/change? (CURRENT SETTINGS: `acceptMessage`)',
                    type: 'string',
                    default: 'list'
                },
                {
                    key: 'value',
                    prompt: 'what would you like to change the setting to?',
                    type: 'string',
                    default: 'view'
                }
              ]
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

    escapeSpecialChars(jsonString) {
        return jsonString
          .replace(/\n/g, "\\n")
      
    }

    /*async updatePermissions(guild, msg)
    {   
        var guildInfo = await this.getGuildInfo(guild.id);

        var currGuild = JSON.parse(this.escapeSpecialChars(guildInfo[0].VerifyModule))

        const verifyChannelID = currGuild.VerifyChannel;
        const MVChannelID = currGuild.MVChannel;
        const AVChannelID = currGuild.AVChannel;
        const StaffRoleID = currGuild.StaffRole;
        const AVRoleID = currGuild.AVRole;
        const MemberRoleID = currGuild.MemberRole;

        const verifyChannel = guild.channels.get(verifyChannelID);
        const MVChannel = guild.channels.get(MVChannelID);
        const AVChannel = guild.channels.get(AVChannelID);
        const StaffRole = guild.roles.get(StaffRoleID);
        const AVRole = guild.roles.get(AVRoleID);
        const MemberRole = guild.roles.get(MemberRoleID);
        
        let channels = guild.channels.array();
        var i = 0;
        for(i = 0; i < channels.length; i++){
            const channel = guild.channels.get(channels[i].id);

            channel.overwritePermissions(guild.defaultRole.id, {
              VIEW_CHANNEL: false
            });
    
            channel.overwritePermissions(MemberRole, {
              VIEW_CHANNEL: true,
              SEND_MESSAGES: true,
              ADD_REACTIONS: true
            });
        }

        if(verifyChannel != undefined)
        {
            verifyChannel.overwritePermissions(guild.defaultRole.id, {
              VIEW_CHANNEL: true,
              SEND_MESSAGES: false,
              ADD_REACTIONS: false
            });
            if(MemberRole != undefined)
            {
                verifyChannel.overwritePermissions(MemberRole, {
                  VIEW_CHANNEL: false
                });
            }
            if(AVRole != undefined)
            {
                verifyChannel.overwritePermissions(AVRole, {
                  VIEW_CHANNEL: false
                });
            }
            if(StaffRole != undefined)
            {
                verifyChannel.overwritePermissions(StaffRole, {
                  VIEW_CHANNEL: true,
                  SEND_MESSAGES: false,
                  ADD_REACTIONS: false
                });
            }

        }

        if(AVChannel != undefined)
        {
            AVChannel.overwritePermissions(guild.defaultRole.id, {
                VIEW_CHANNEL: false
            });

            if(StaffRole != undefined)
            {
                AVChannel.overwritePermissions(StaffRole, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            }

            if(AVRole != undefined)
            {
                AVChannel.overwritePermissions(AVRole, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            }

            if(MemberRole != undefined)
            {
                AVChannel.overwritePermissions(MemberRole, {
                    VIEW_CHANNEL: false
                });
            }
        }
        
        if(MVChannel != undefined)
        {
            if(StaffRole != undefined)
            {
                MVChannel.overwritePermissions(StaffRole, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            }

            if(MemberRole != undefined)
            {
                MVChannel.overwritePermissions(MemberRole, {
                    VIEW_CHANNEL: false
                });
            }
        }
    }*/

    async updateVerifySetting(setting, value, msg, settingV, valueV){
        let guildInfo = await this.getGuildInfo(msg.guild.id);

        let VerifyModuleJSON = guildInfo[0].VerifyModule;

        var VerifyModuleOBJ = JSON.parse(this.escapeSpecialChars(VerifyModuleJSON));

        switch(setting) {
            case "VerifyChannel": VerifyModuleOBJ.VerifyChannel = value;
            break;
            case "AVChannel": VerifyModuleOBJ.AVChannel = value;
            break;
            case "MVChannel": VerifyModuleOBJ.MVChannel = value;
            break;
            case "StaffRole": VerifyModuleOBJ.StaffRole = value;
            break;
            case "MemberRole": VerifyModuleOBJ.MemberRole = value;
            break;
            case "AVRole": VerifyModuleOBJ.AVRole = value;
            break;
            case "VMessage": VerifyModuleOBJ.VMessage = value;
            break;
            default: VerifyModuleOBJ = VerifyModuleOBJ;
        }
        
        var final = JSON.stringify(VerifyModuleOBJ);

        var a = 0;
        var count = 0;
        for(a = 0; a < JSON.stringify(VerifyModuleOBJ).length; a++)
        {
            if(JSON.stringify(VerifyModuleOBJ).charAt(a) == "'")
            {
                final = [final.slice(0, a+count), '\\', final.slice(a+count)].join('');
                count++;

            }
        }

        var sql = "UPDATE guildsettings SET VerifyModule = '" + final + "' WHERE Guild = '" + msg.guild.id + "'";

        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log(result.affectedRows + " record(s) updated");
        });

        msg.channel.send("`" + settingV + "` **has been updated to** `" + valueV + "`");

    }

    updateRole(setting, value, msg, settingV)
    {   
        if(msg.mentions.roles.first() == undefined)
        {
            msg.channel.send("That is not a valid role! (Note: Just putting the role ID will not work!)");
            return;
        }

        let role = msg.mentions.roles.first().id

        this.updateVerifySetting(setting, role, msg, settingV, `<@&${value}>`);
        
        //this.updatePermissions(msg.guild, msg)
        msg.channel.send("Sorry, Permissions Updating Is Currently Broken. You'll have to do it manually.")
    }

    updateChannel(setting, value, msg, settingV)
    {
        if(msg.mentions.channels.first() == undefined)
        {
            msg.channel.send("That is not a valid channel! (Note: Just putting the channel ID will not work!)");
            return;
        }

        let channel = msg.mentions.channels.first().id
        
        this.updateVerifySetting(setting, channel, msg, settingV, `<#${value}>`);
        
        //this.updatePermissions(msg.guild, msg)
        msg.channel.send("Sorry, Permissions Updating Is Currently Broken. You'll have to do it manually.")
    }

    
    async run(msg, { setting, value }) {
        const settings = new Discord.MessageEmbed()
            .setTitle('Settings')
            .setDescription('**The `-settings` command has been removed!** Go to https://www.autumnbot.net/dashboard to setup the Verification Module.')
            .setColor('#db583e')
        

        let guildInfo = await this.getGuildInfo(msg.guild.id);

        if (!msg.member.hasPermission('ADMINISTRATOR') && msg.author.id != "279910519467671554"){
            msg.reply("You don't have the `ADMINISTRATOR` permission!").then(function (msg) { 
                msg.delete(10000)
            });
            msg.delete();
            return;
        };

        if (guildInfo[0] == undefined){
            msg.reply("You need to setup your server to change the settings!").then(function (msg) { 
                msg.delete(10000)
            });
            msg.delete();
            return;
        }

        let currGuild = JSON.parse(this.escapeSpecialChars(guildInfo[0].VerifyModule));

        if(value === "view"){
            if(setting == "acceptMessage")
            { //Accept Message Setting View

                const value = currGuild.VMessage;
                msg.channel.send(`Setting: \`${setting}\`\nValue: \`"${value}"\``);

            }
            else if(setting == "verifyChannel")
            { //Verify Channel Setting View

                const value = currGuild.VChannel;
                msg.channel.send(`Setting: \`${setting}\`\nValue: \`<#${value}>\``);

            }
            else if(setting == "awaitVerifyChannel")
            { //Await Verify Channel Setting View

                const value = currGuild.AVChannel;
                msg.channel.send(`Setting: \`${setting}\`\nValue: \`<#${value}>\``);

            }
            else if(setting == "modVerifyChannel")
            { //Mod Verify Channel Setting View

                const value = currGuild.MVChannel;
                msg.channel.send(`Setting: \`${setting}\`\nValue: \`<#${value}>\``);

            }
            else if(setting == "staffRole")
            { //Staff Role Setting View

                const value = currGuild.StaffRole;
                msg.channel.send(`Setting: \`${setting}\`\nValue: \`<#&${value}>\``);

            }
            else if(setting == "memberRole")
            { //Member Role Setting View

                const value = currGuild.MemberRole;
                msg.channel.send(`Setting: \`${setting}\`\nValue: \`<#&${value}>\``);

            }
            else if(setting == "awaitVerifyRole")
            { //Await Verify Role Setting View

                const value = currGuild.AVRole;
                msg.channel.send(`Setting: \`${setting}\`\nValue: \`<@&${value}>\``);

            }
            else if(setting == "list")
            { //Settings List

                msg.channel.send(settings);

            }
            else
            {
                msg.channel.send("`" + setting + "` is not a setting! The available settings are: `acceptMessage`");
            }
        }else{
            if(setting == "acceptMessage"){ //Accept Message Setting Change
                
                this.updateVerifySetting("VMessage", value, msg, "acceptMessage",  `\`${value}>\``);
            }else if(setting == "verifyChannel"){ //Verify Channel Setting Change

                this.updateChannel("VerifyChannel", value, msg, "verifyChannel");

            }else if(setting == "awaitVerifyChannel"){ //Awaiting Verification Channel Setting Change

                this.updateChannel("AVChannel", value, msg, "awaitVerifyChannel");

            }else if(setting == "modVerifyChannel"){ //Mod Verification Channel Setting Change

                this.updateChannel("MVChannel", value, msg, "modVerifyChannel");

            }else if(setting == "staffRole"){ //Staff Role Setting Change

                this.updateRole("StaffRole", value, msg, "staffChannel");

            }else if(setting == "memberRole"){ //Member Role Setting Change

                this.updateRole("MemberRole", value, msg, "memberRole");

            }else if(setting == "awaitVerifyRole"){ //AV Role Setting Change

                this.updateRole("AVRole", value, msg, "awaitVerifyRole");

            }
            else if(setting == "list"){ //Settings List

                msg.channel.send(settings);

            }else{
                msg.channel.send("`" + setting + "` is not a setting! The available settings are: `acceptMessage`");
            }
        }
    }
}
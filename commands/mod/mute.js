const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const timestring = require('timestring');
const prettyMs = require('pretty-ms');
const Guild = require('../../guild/guild');
const Discord = require('discord.js');

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function memberFilterInexact(search) {
	return mem => mem.user.username.toLowerCase().includes(search.toLowerCase()) ||
		(mem.nickname && mem.nickname.toLowerCase().includes(search.toLowerCase())) ||
        `${mem.user.username.toLowerCase()}#${mem.user.discriminator}`.includes(search.toLowerCase()) ||
        search.includes(mem.user.id);
}

module.exports = class ClassName extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            aliases: [],
            group: 'mod',
            memberName: 'mute',
            description: 'Mutes the targetted user for a specific amount of time.',
            details: oneLine`
            Mutes the targetted user for a specific amount of time.
            `,
            examples: ['-mute @user#1234 30m "Annoying"'],

            args: [
                {
                    key: 'member',
                    prompt: 'Who would you like to mute?',
                    type: 'string',
                    default: ''
                },
                {
                    key: 'muteTime',
                    prompt: 'How long would you like to mute this user for?',
                    type: 'string',
                    default: 'infinite'
                },
                {
                    key: 'reason',
                    prompt: 'Why are you muting them?',
                    type: 'string',
                    default: 'No Reason Given'
                }
            ]
        })
    }

    async run(msg, { member, muteTime, reason }) {

        var guild = new Guild(msg.guild.id);

        var mod = guild.ModModule.settings;

        var time = muteTime;
        //------------------------------------
        
        try {
            timestring(time);
          }
          catch(err) {
            if(err)
            {
                time = 'infinite'
            }
          }

        if (mod.enabled == false) return;

        if(!msg.member.roles.cache.has(mod.StaffRole))
        {
            msg.channel.send("You do not have permission to run this command!");
            return;
        }

        //Member Search & Errors

        if(member === '')
        {
            var d = new Discord.MessageEmbed()
            .setTitle('ERROR: \`No Member Provided\`')
            .setDescription(`**Command Usage**\n-mute {member} {duration \`optional\`} {reason \`optional\`}\n\n **Example**\n\`-mute @Username#0000 10m Spam\``)
            msg.channel.send(d);
            return
        }

        var members = msg.guild.members.cache;
        
        var result = members.filter(memberFilterInexact(member))

        var user = result.first();

        if(result.size > 1)
        {
            var str = '';

            result.each(user => str += ` • <@!${user.id}>\n`)

            var a = new Discord.MessageEmbed()
            .setTitle('Uh Oh!')
            .setDescription(`Multiple members found, please try again (and be more specific)!\n${str}`)
            msg.channel.send(a);
            return;
        }
        else if(!result.size)
        {
            var c = new Discord.MessageEmbed()
            .setTitle(`ERROR: \`Invalid User '${member}'\``)
            .setDescription(`**Command Usage**\n-mute {member} {duration \`optional\`} {reason \`optional\`}\n\n **Example**\n\`-mute @Username#0000 10m Spam\``)
            msg.channel.send(c);
            return
        }

        //-----------------------

        if(!user.bannable || user.roles.cache.first().position > msg.member.roles.cache.first().position)
        {
            msg.channel.send(`You cannot mute this user!`);
            return;
        }

        var mutedRole = mod.MutedRole;

        var id;

        var idIsUnique = false;

        var history = guild.ModModule.getHistory(user.id);

        while(!idIsUnique)
        {
            id = makeid(5);
            if(!history[id]) idIsUnique = true;
        }

        var str = reason;

        if (time == 'infinite') {
            if (muteTime == 'infinite') {
                str = reason;
            }
            else {
                if (reason == 'No Reason Given') {
                    str = muteTime;
                }
                else {
                    str = muteTime + " " + reason;
                }
            }

            var response = new Discord.MessageEmbed()
            .setAuthor('Moderation', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
            .setTitle(`${user.user.tag} has been muted!`)
            .setDescription(`**Reason:** ${str}\n**Duration:** Permament\n`)
            .setThumbnail(user.user.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 512
            }))
            .setColor(`#db583e`)
            .setFooter(`Muted By ${msg.author.username} | ID: ${id}`, msg.author.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 512
            }))
            .setTimestamp()

            if(mod.ModLogEnabled)
            {
                var modlog = msg.guild.channels.cache.get(mod.ModLog);
    
                var log = new Discord.MessageEmbed()
                .setAuthor('Moderation', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
                .setTitle(`User Muted`)
                .setDescription(
                    ` • **ID:** ${id}\n` +
                    ` • **User:** ${user}\n` +
                    ` • **Muted By:** ${msg.author}\n` +
                    ` • **Duration:** Permanent\n` +
                    ` • **Reason:** ${str}\n`
                )
                .setColor(`#db583e`)
                .setTimestamp()
    
                modlog.send(log);
            }

            msg.channel.send(response);
            guild.ModModule.muteUser(user.id, "infinite", str, user.user.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 512
            }), user.user.username, user.user.discriminator, msg.author.id, msg.author.username, msg.author.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 512
            }), msg.author.discriminator);

            guild.ModModule.addHistory(user.id, "infinite", id, "mute", str, user.user.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 512
            }), user.user.username, user.user.discriminator, msg.author.id, msg.author.username, msg.author.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 512
            }), msg.author.discriminator);
        }
        else {

            var response = new Discord.MessageEmbed()
            .setAuthor('Moderation', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
            .setTitle(`${user.user.tag} has been muted!`)
            .setDescription(`**Reason:** ${str}\n**Duration:** ${prettyMs(timestring(time) * 1000)}\n`)
            .setThumbnail(user.user.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 512
            }))
            .setColor(`#db583e`)
            .setFooter(`Muted By ${msg.author.username} | ID: ${id}`, msg.author.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 512
            }))
            .setTimestamp()

            if(mod.ModLogEnabled)
            {
                var modlog = msg.guild.channels.cache.get(mod.ModLog);
    
                var log = new Discord.MessageEmbed()
                .setAuthor('Moderation', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
                .setTitle(`User Muted`)
                .setDescription(
                    ` • **ID:** ${id}\n` +
                    ` • **User:** ${user}\n` +
                    ` • **Muted By:** ${msg.author}\n` +
                    ` • **Duration:** ${prettyMs(timestring(time) * 1000)}\n` +
                    ` • **Reason:** ${reason}\n`
                )
                .setColor(`#db583e`)
                .setTimestamp()
    
                modlog.send(log);
            }

            if (timestring(time) < 30) {
                msg.channel.send("You must mute the user for at least **30 seconds**.");
                return;
            };
            msg.channel.send(response);
            guild.ModModule.muteUser(user.id, timestring(time) * 1000, reason, user.user.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 512
            }), user.user.username, user.user.discriminator, msg.author.id, msg.author.username, msg.author.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 512
            }), msg.author.discriminator);

            guild.ModModule.addHistory(user.id, timestring(time) * 1000, id, "mute", reason, user.user.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 512
            }), user.user.username, user.user.discriminator, msg.author.id, msg.author.username, msg.author.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 512
            }), msg.author.discriminator);
        }

        user.roles.add(mutedRole);
    }
}
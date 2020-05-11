const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const timestring = require('timestring');
const prettyMs = require('pretty-ms');
const { Guild } = require('../../guild.js');
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

function capitalize(s) {
	if (typeof s !== 'string') return ''
	return s.charAt(0).toUpperCase() + s.slice(1)
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
            name: 'history',
            aliases: [],
            group: 'mod',
            memberName: 'history',
            description: 'Warns the targetted user for a specific amount of time.',
            details: oneLine`
            Warns the targetted user for a specific amount of time.
            `,
            examples: ['-history @user#1234'],

            args: [
                {
                    key: 'member',
                    prompt: 'Who would you like to warn?',
                    type: 'string',
                    default: ''
                },
                {
                    key: 'action',
                    prompt: 'What would you like to do?',
                    type: 'string',
                    default: 'none'
                },
                {
                    key: 'id',
                    prompt: 'Which punishment would you like to remove?',
                    type: 'string',
                    default: ''
                }
              ]
        })
    }

    async run(msg, {member, action, id}) {
        var guild = new Guild(msg.guild.id);

        var mod = guild.ModModule;

        if(mod.enabled == false) return;

        //Member Search & Errors

        if(member === '')
        {
            var d = new Discord.MessageEmbed()
            .setTitle('ERROR: \`No Member Provided\`')
            .setDescription(`**Command Usage**\n-history {member}\n\n **Example**\n\`-history @username#0000\``)
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
            .setDescription(`**Command Usage**\n-history {member}\n\n **Example**\n\`-history @username#0000\``)
            msg.channel.send(c);
            return
        }

        //------------------------------------

        if(!user.bannable || user.roles.cache.first().position > msg.member.roles.cache.first().position)
        {
            msg.channel.send(`You cannot view/edit this user's punishment history!`);
            return;
        }

        var history = guild.getHistory(user.id);

        delete history['userInfo'];

        var str = '';

        for (const id in history) {
            var entry = history[id];

            var date = new Date(entry.date);

            if(entry.time == 'infinite')
            {
                var time = 'Permanent'
            }
            else
            {
                var time = prettyMs(entry.time);
            }

            if(entry.punishment === 'kick')
            {
                str += 
                `\n**${capitalize(entry.punishment)}** (ID: **${id}**)\n` +
                ` • **Date:** ${date.toDateString()}\n` +
                ` • **Issued By:** ${entry.staff.username}#${entry.staff.tag}\n` +
                ` • **Reason:** ${entry.reason}\n`
            }
            else
            {
                str += 
                `\n**${capitalize(entry.punishment)}** (ID: **${id}**)\n` +
                ` • **Date:** ${date.toDateString()}\n` +
                ` • **Duration:** ${time}\n` +
                ` • **Issued By:** ${entry.staff.username}#${entry.staff.tag}\n` +
                ` • **Reason:** ${entry.reason}\n`
            }
        }

        if(str === '')
        {
            str += `${user} is a model citizen! I couldn't find anything on them!`
        }

        if(action == 'clear')
        {
            var embed1 = new Discord.MessageEmbed()
            .setAuthor('Moderation', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
            .setTitle(`**${user.user.username}'s history has been cleared.**`)
            .setColor(`#db583e`);


            msg.channel.send(embed1);
            guild.clearHistory(user.id);   
        }
        else if(action == 'remove')
        {
            if(id == '')
            {
                var embed = new Discord.MessageEmbed()
                .setAuthor('Moderation', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
                .setTitle(`**Please provide a punishment ID**`)
                .setColor(`#db583e`);

                msg.channel.send(embed);
            }
            else if(!history[id])
            {
                var embed = new Discord.MessageEmbed()
                .setAuthor('Moderation', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
                .setTitle(`**\`${id}\` is not a valid punishment ID**`)
                .setColor(`#db583e`);

                msg.channel.send(embed);
            }
            else
            {
                var embed = new Discord.MessageEmbed()
                .setAuthor('Moderation', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
                .setTitle(`**Punishment \`${id}\` has been removed from ${user.user.username}'s history.**`)
                .setColor(`#db583e`);

                msg.channel.send(embed);
                guild.removeHistory(user.id, id); 
            }
        }
        else
        {
            var response = new Discord.MessageEmbed()
            .setAuthor('Moderation', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
            .setTitle(`${user.user.tag}'s Punishment History`)
            .setDescription(str)
            .setThumbnail(user.user.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 512
            }))
            .setColor(`#db583e`)
            .setFooter(`Requested By ${msg.author.username}`, msg.author.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 512
            }))
            .setTimestamp()
        
            msg.channel.send(response);
        }
    }
}
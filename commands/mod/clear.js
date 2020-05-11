const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const timestring = require('timestring');
const prettyMs = require('pretty-ms');
const { Guild } = require('../../guild.js');
const Discord = require('discord.js');

function banFilterInexact(search) {
	return ban => ban.user.username.toLowerCase().includes(search) ||
        `${ban.user.username.toLowerCase()}#${ban.user.discriminator}`.includes(search.toLowerCase()) ||
        `@${ban.user.username.toLowerCase()}#${ban.user.discriminator}`.includes(search.toLowerCase()) ||
        search.includes(ban.user.id);
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
            name: 'clear',
            aliases: [],
            group: 'mod',
            memberName: 'clear',
            description: 'Clears the set amount of messages from the channel.',
            details: oneLine`
            Clears the set amount of messages from the channel.
            `,
            examples: ['-clear 10'],

            args: [
                {
                    key: 'int',
                    prompt: 'How many messages would you like to clear?',
                    type: 'integer',
                    default: 0
                }
            ]
        })
    }

    async run(msg, { int }) {
        var guild = new Guild(msg.guild.id);

        var mod = await guild.ModModule;

        if (mod.enabled == false) return;
        
        if(!msg.member.roles.cache.has(mod.StaffRole))
        {
            msg.channel.send("You do not have permission to run this command!");
            return;
        }
        
        if(int > 100)
        {
            msg.delete({
                timeout: 300
            })
            var a = new Discord.MessageEmbed()
            .setAuthor('Moderation', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
            .setTitle(`You can't delete more than 100 messages at once!`)
            .setColor(`#db583e`)
            .setTimestamp()

            msg.channel.send(a)
            .then((message) => {
                message.delete({
                    timeout: 3000
                })
            });
            return;
        }

        if(int <= 0)
        {
            msg.delete({
                timeout: 300
            })
            .then(() => {
                var b = new Discord.MessageEmbed()
                .setAuthor('Moderation', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
                .setTitle(`0 message(s) cleared.`)
                .setColor(`#db583e`)
                .setFooter(`Requested By ${msg.author.username}`, msg.author.displayAvatarURL({
                    format: 'png',
                    dynamic: true,
                    size: 512
                }))
                .setTimestamp()
    
                msg.channel.send(b)
                .then((embed) => {
                    embed.delete({
                        timeout: 5000
                    })
                })
            })
            .catch(console.error)
            return;
        }

        msg.delete({
            timeout: 300
        })
        .then(() => {
            msg.channel.bulkDelete(int)
            .then((messages) => {
                var response = new Discord.MessageEmbed()
                .setAuthor('Moderation', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
                .setTitle(`${messages.size} message(s) cleared.`)
                .setColor(`#db583e`)
                .setFooter(`Requested By ${msg.author.username}`, msg.author.displayAvatarURL({
                    format: 'png',
                    dynamic: true,
                    size: 512
                }))
                .setTimestamp()

                msg.channel.send(response)
                .then((embed) => {
                    embed.delete({
                        timeout: 3000
                    })
                })
                .catch(console.error)

                if(mod.ModLogEnabled)
                {
                    var modlog = msg.guild.channels.cache.get(mod.ModLog);

                    var log = new Discord.MessageEmbed()
                    .setAuthor('Moderation', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
                    .setTitle(`Messages Cleared`)
                    .setDescription(
                        ` • **Amount:** ${messages.size}\n` +
                        ` • **Channel:** ${msg.channel}\n` +
                        ` • **Requested By:** ${msg.author}\n`
                    )
                    .setColor(`#db583e`)
                    .setTimestamp()

                    modlog.send(log);
                }
            })
            .catch(console.error)
        })
        .catch(console.error)
    }
}
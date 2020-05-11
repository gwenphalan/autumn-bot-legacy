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
            name: 'unban',
            aliases: [],
            group: 'mod',
            memberName: 'unban',
            description: 'Unbans the targetted user.',
            details: oneLine`
            Unbans the targetted user.
            `,
            examples: ['-unban @user#1234 He said sorry.'],

            args: [
                {
                    key: 'member',
                    prompt: 'What is the id of the user you would you like to unban?',
                    type: 'string',
                    default: ''
                },
                {
                    key: 'reason',
                    prompt: 'Why are you unbanning them?',
                    type: 'string',
                    default: 'No Reason Given'
                }
            ]
        })
    }

    async run(msg, { member, reason }) {
        var guild = new Guild(msg.guild.id);

        var mod = await guild.ModModule;

        if (mod.enabled == false) return;
        
        if(!msg.member.roles.cache.has(mod.StaffRole))
        {
            msg.channel.send("You do not have permission to run this command!");
            return;
        }
        
        var bans = await msg.guild.fetchBans();
        var members = msg.guild.members.cache
    

        //Member Search & Errors

        if(member === '')
        {
            var d = new Discord.MessageEmbed()
            .setTitle('ERROR: \`No Member Provided\`')
            .setDescription(`**Command Usage**\n-unban {member} {duration \`optional\`} {reason \`optional\`}\n\n **Example**\n\`-mute @Username#0000 10m Spam\``)
            msg.channel.send(d);
            return
        }
        var result = bans.filter(banFilterInexact(member));

        var result1 = members.filter(memberFilterInexact(member));

        if (result.size > 1 || 
            result1.size > 1 || 
            result.size >= 1 && result1.size >= 1)
        {
            var str = '';

            result.each(user => str += ` • ${user.user}\n`)
            result1.each(user => str += ` • ${user}\n`)

            var a = new Discord.MessageEmbed()
            .setTitle('Uh Oh!')
            .setDescription(`Multiple members found, please try again (and be more specific)!\n${str}`)
            msg.channel.send(a);
            return;
        }
        else if(!result.size && !result1.size)
        {
            var c = new Discord.MessageEmbed()
            .setTitle(`ERROR: \`Invalid User '${member}'\``)
            .setDescription(`**Command Usage**\n-unban {member} {reason \`optional\`}\n\n **Example**\n\`-mute @Username#0000 10m Spam\``)
            msg.channel.send(c);
            return
        }
        else if(result1.size == 1)
        {
            var e = new Discord.MessageEmbed()
            .setTitle(`ERROR: \`User Not Banned\``)
            .setDescription(`${result1.first()} is not banned!\n\n**Command Usage**\n-unban {member} {reason \`optional\`}\n\n **Example**\n\`-mute @Username#0000 10m Spam\``)
            msg.channel.send(e);
            return
        }
        var user = result.first().user;


        var userID = user.id;
        var bans = await guild.getBans();

        var guildBans = await msg.guild.fetchBans();


        var response = new Discord.MessageEmbed()
        .setAuthor('Moderation', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
        .setTitle(`${user.tag} has been unbanned!`)
        .setDescription(`**Reason:** ${reason}`)
        .setThumbnail(user.displayAvatarURL({
            format: 'png',
            dynamic: true,
            size: 512
        }))
        .setColor(`#db583e`)
        .setFooter(`Unbanned By ${msg.author.username}`, msg.author.displayAvatarURL({
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
            .setTitle(`User Unbanned`)
            .setDescription(
                ` • **User:** ${user}\n` +
                ` • **Unbanned By:** ${msg.author}\n` +
                ` • **Reason:** ${reason}\n`
            )
            .setColor(`#db583e`)
            .setTimestamp()

            modlog.send(log);
        }

        msg.channel.send(response)

        msg.guild.members.unban(userID);
        guild.unbanUser(userID);
    }
}
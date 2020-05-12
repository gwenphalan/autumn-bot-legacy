const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Guild = require('../../guild/guild.js');
const Discord = require('discord.js');

function memberFilterInexact(search) {
	return mem => mem.user.username.toLowerCase().includes(search.toLowerCase()) ||
		(mem.nickname && mem.nickname.toLowerCase().includes(search.toLowerCase())) ||
        `${mem.user.username.toLowerCase()}#${mem.user.discriminator}`.includes(search.toLowerCase()) ||
        search.includes(mem.user.id);
}

module.exports = class ClassName extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
            aliases: [],
            group: 'mod',
            memberName: 'unmute',
            description: 'Unmutes the targetted user.',
            details: oneLine`
            Unmutes the targetted user.
            `,
            examples: ['-unmute @user#1234 He said sorry.'],

            args: [
                {
                    key: 'member',
                    prompt: 'Who would you like to unmute?',
                    type: 'string',
                    default: ''
                },
                {
                    key: 'reason',
                    prompt: 'Why are you unmuting them?',
                    type: 'string',
                    default: 'No Reason Given'
                }
            ]
        })
    }

    async run(msg, { member, reason }) {

        var guild = new Guild(msg.guild.id);

        var mod = guild.ModModule.settins;

        var mutes = mod.mutes ? mod.mutes : {};

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

        if(!mutes[user.id])
        {
            var g = new Discord.MessageEmbed()
            .setTitle(`ERROR: \`User Not Muted\``)
            .setDescription(`${user} is note muted!\n\n**Command Usage**\n-mute {member} {duration \`optional\`} {reason \`optional\`}\n\n **Example**\n\`-mute @Username#0000 10m Spam\``)
            msg.channel.send(g);
            return
        }

        var mutedRole = mod.MutedRole;

        var response = new Discord.MessageEmbed()
        .setAuthor('Moderation', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
        .setTitle(`${user.user.tag} has been unmuted!`)
        .setDescription(`**Reason:** ${reason}`)
        .setThumbnail(user.user.displayAvatarURL({
            format: 'png',
            dynamic: true,
            size: 512
        }))
        .setColor(`#db583e`)
        .setFooter(`Unmuted By ${msg.author.username}`, msg.author.displayAvatarURL({
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
            .setTitle(`User Unmuted`)
            .setDescription(
                ` • **User:** ${user}\n` +
                ` • **Unmuted By:** ${msg.author}\n` +
                ` • **Reason:** ${reason}\n`
            )
            .setColor(`#db583e`)
            .setTimestamp()

            modlog.send(log);
        }

        msg.channel.send(response)

        user.roles.remove(mutedRole);
        guild.ModModule.unmuteUser(user.id);
    }
}
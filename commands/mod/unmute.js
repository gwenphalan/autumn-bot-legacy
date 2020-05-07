const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const timestring = require('timestring');
const prettyMs = require('pretty-ms');
const Guild = require('../../guild.js');

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
                    key: 'user',
                    prompt: 'Who would you like to unmute?',
                    type: 'member'
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

    async run(msg, { user, reason }) {

        var guild = new Guild(msg.guild.id);

        var mod = await guild.modModule();

        var mutes = await guild.getMutes();

        if (mod.enabled == false) return;

        if(!msg.member.roles.cache.has(mod.StaffRole))
        {
            msg.channel.send("You do not have permission to run this command!");
            return;
        }

        if(!mutes[user.id])
        {
            msg.channel.send(`\`${user.user.tag}\` is not muted!`);
            return;
        }

        var mutedRole = mod.MutedRole;

        msg.channel.send(`Unmute \`${user.user.tag}\` for reason: \`${reason}\``)

        user.roles.remove(mutedRole);
        guild.unmuteUser(user.id);
    }
}
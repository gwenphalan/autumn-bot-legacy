const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const timestring = require('timestring');
const prettyMs = require('pretty-ms');
const Guild = require('../../guild.js');

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
            examples: ['-ban @user#1234 30m "Annoying"'],

            args: [
                {
                    key: 'user',
                    prompt: 'Who would you like to mute?',
                    type: 'member'
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

    async run(msg, { user, muteTime, reason }) {

        var guild = new Guild(msg.guild.id);

        var mod = await guild.ModModule;

        var time = muteTime;

        if (mod.enabled == false) return;

        try {
            timestring(time);
        }
        catch (err) {
            if (err) {
                time = 'infinite'
            }
        }

        if(!user.bannable)
        {
            msg.channel.send(`You cannot mute this user!`);
            return;
        }

        var mutedRole = mod.MutedRole;

        if (!mutedRole || !msg.guild.roles.cache.get(mutedRole)) {
            msg.guild.roles.create({
                data: {
                    name: 'Muted',
                    color: '#4a4a4a',
                },
                reason: 'Required to mute users.',
            })
                .then(async function (role) {
                    console.log(role.id);

                    msg.guild.channels.cache.each(channel => {
                        channel.overwritePermissions([
                            {
                                id: role.id,
                                deny: ['SEND_MESSAGES'],
                            },
                        ], 'Required to mute users.');
                    });
                    mod.MutedRole = role.id;

                    guild.updateModule("ModModule", mod);
                })
                .catch(console.error);
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

            msg.channel.send(`Muting \`${user.user.tag}\` for reason: \`${str}\``);
            guild.muteUser(user.id, "infinite", str, user.user.displayAvatarURL().replace('webp', 'png'), user.user.username, user.user.discriminator);
        }
        else {
            if (timestring(time) < 30) {
                msg.channel.send("You must mute the user for at least **30 seconds**.");
                return;
            };
            msg.channel.send(`Mute \`${user.user.tag}\` for \`${prettyMs(timestring(time) * 1000)}\` for reason: \`${str}\``);
            guild.muteUser(user.id, timestring(time) * 1000, reason, user.user.displayAvatarURL().replace('webp', 'png'), user.user.username, user.user.discriminator);
        }

        user.roles.add(mutedRole);
    }
}
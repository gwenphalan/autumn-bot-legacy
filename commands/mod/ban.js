const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const timestring = require('timestring');
const prettyMs = require('pretty-ms');
const Guild = require('../../guild.js');

module.exports = class ClassName extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            aliases: [],
            group: 'mod',
            memberName: 'ban',
            description: 'Bans the targetted user for a specific amount of time.',
            details: oneLine`
            Bans the targetted user for a specific amount of time.
            `,
            examples: ['-ban @user#1234 30m "Annoying"'],

            args: [
                {
                    key: 'user',
                    prompt: 'Who would you like to ban?',
                    type: 'member'
                },
                {
                    key: 'banTime',
                    prompt: 'How long would you like to ban this user for?',
                    type: 'string',
                    default: 'infinite'
                },
                {
                    key: 'reason',
                    prompt: 'Why are you banning them?',
                    type: 'string',
                    default: 'No Reason Given'
                }
              ]
        })
    }

    async run(msg, {user, banTime, reason}) {
        var guild = new Guild(msg.guild.id);

        var mod = await guild.modModule();

        var time = banTime;

        if(mod.enabled == false) return;

        if(!msg.member.roles.cache.has(mod.StaffRole))
        {
            msg.channel.send("You do not have permission to run this command!");
            return;
        }
        
        try {
            timestring(time);
          }
          catch(err) {
            if(err)
            {
                time = 'infinite'
            }
          }

        if(!user.bannable)
        {
            msg.channel.send(`You cannot ban this user!`);
            return;
        }

        var str = reason;
        
        if(time == 'infinite'){
            if(banTime == 'infinite')
            {
                str = reason;
            }
            else{
                if(reason == 'No Reason Given')
                {
                    str = banTime;
                }
                else
                {
                    str = banTime + " " + reason;
                }
            }

            msg.channel.send(`Banning ${user.user.tag} for reason: \`${str}\``);
            guild.banUser(user.id, "infinite");
        }
        else
        {
            if(timestring(time) < 30){
                msg.channel.send("You must ban the user for at least **30 seconds**.");
                return;
            };
            msg.channel.send(`Banning ${user.user.tag} for \`${prettyMs(timestring(time) * 1000)}\` for reason: \`${str}\``);
            guild.banUser(user.id, timestring(time) * 1000);
        }

        msg.guild.members.ban(user.id, {reason: str});
    }
}
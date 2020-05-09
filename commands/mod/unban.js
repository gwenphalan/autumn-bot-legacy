const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const timestring = require('timestring');
const prettyMs = require('pretty-ms');
const Guild = require('../../guild.js');

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
                    key: 'bannedUserID',
                    prompt: 'Who would you like to unban?',
                    type: 'string'
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

    async run(msg, { bannedUserID, reason }) {
        
        console.log(bannedUserID);

        var userID = bannedUserID.replace('<','').replace('>','').replace('@','').replace('!','');

        var guild = new Guild(msg.guild.id);

        var mod = await guild.ModModule;

        if (mod.enabled == false) return;
        
        if(!msg.member.roles.cache.has(mod.StaffRole))
        {
            msg.channel.send("You do not have permission to run this command!");
            return;
        }

        var bans = await guild.getBans();

        if(!bans[userID])
        {
            msg.channel.send(`\`${userID}\` is not banned!`);
            return;
        }

        var guildBans = await msg.guild.fetchBans();

        console.log(guildBans);

        var bannedUser = guildBans.get('◦•●◉✿ 𝒩𝒶𝒾𝒶 ✿◉●•◦');

        console.log(bannedUser);

        msg.channel.send(`Unbanned \`${userID}\` for reason: \`${reason}\``)

        //msg.guild.members.unban(userID);
        //guild.unbanUser(userID);
    }
}
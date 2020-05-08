const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const timestring = require('timestring');
const prettyMs = require('pretty-ms');
const Guild = require('../../guild.js');

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = class ClassName extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            aliases: [],
            group: 'mod',
            memberName: 'warn',
            description: 'Warns the targetted user for a specific amount of time.',
            details: oneLine`
            Warns the targetted user for a specific amount of time.
            `,
            examples: ['-ban @user#1234 30m "Annoying"'],

            args: [
                {
                    key: 'user',
                    prompt: 'Who would you like to warn?',
                    type: 'member'
                },
                {
                    key: 'reason',
                    prompt: 'Why are you banning warn?',
                    type: 'string',
                    default: 'No Reason Given'
                }
              ]
        })
    }

    async run(msg, {user, reason}) {
        var guild = new Guild(msg.guild.id);

        var mod = await guild.modModule();

        var warns = guild.getWarns();

        if(mod.enabled == false) return;

        if(!user.bannable || user.roles.cache.first().position > msg.member.roles.cache.first().position)
        {
            msg.channel.send(`You cannot warn this user!`);
            return;
        }

        var id;

        var idIsUnique = false;

        while(!idIsUnique)
        {
            id = makeid(5);
            if(!warns[id]) idIsUnique = true;
        }
        
        msg.channel.send(`Warning ${user.user.tag} for reason: \`${reason}\`\nWarn ID: ${id}`);
        
        guild.warnUser(user.id, id, reason, user.user.displayAvatarURL().replace('webp', 'png'), user.user.username, user.user.discriminator);
    }
}
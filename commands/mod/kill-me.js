const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class ClassName extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'kill-me',
            aliases: [],
            group: 'mod',
            memberName: 'kill-me',
            description: 'Kills gwen.',
            details: oneLine`
            Kills gwen.
            `,
            examples: ['example'],
        })
    }

    async run(msg) {
        if (msg.author.id != "279910519467671554"){
            msg.reply("You're not allowed to die!");
            return;
        };

        msg.channel.send("*Kills Gwen*\n\nGwen is dead now.");
        
    }
}
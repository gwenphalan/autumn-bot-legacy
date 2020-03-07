const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Discord = require('discord.js');

module.exports = class ClassName extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: [],
            group: 'util',
            memberName: 'help',
            description: 'Displays a list of commands',
            details: oneLine`
                Displays a list of commands.
            `,
            examples: ['-help'],
        })
    }

    async run(msg) {
        const help = new Discord.MessageEmbed()
            .setTitle('Help')
            .setDescription('Go to **https://www.autumnbot.net/commands** for a list of commands!')
            .setColor('#db583e')

        msg.channel.send(help);
    }
}
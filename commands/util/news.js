const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Discord = require('discord.js')

module.exports = class ClassName extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'news',
            aliases: [],
            group: 'util',
            memberName: 'news',
            description: 'Displays recent bot news',
            details: oneLine`
                Displays recent bot news.
            `,
            examples: ['-help'],
        })
    }

    async run(msg) {
        const help = new Discord.MessageEmbed()
            .setAuthor('Autumn Bot News', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
            .setDescription('**0.0.5 Changelog | Verified Role Update**\n\n- Added option to give users a role once they are verified.\n\n**To get regular updates on the bot\'s development, join the official [discord server](https://discord.gg/DfByvyN)!**')
            .setColor('#db583e')
            .setURL('https://discord.gg/DfByvyN')

        msg.channel.send(help);
    }
}
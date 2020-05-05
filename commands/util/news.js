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
            .setAuthor('News', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
            .setDescription('The dashboard has been released! Now you can manage each of your servers\' settings from one place, see which servers your bot is in, and disable/enable different modules. At the moment, the Verification Module is the only one, but more are coming in the future.\n\n**0.0.4 Changelog | Dashboard Update**\n\n- `-setup` and `-settings` no longer exist! You can now setup your server and change your settings straight from the [dashboard](https://www.autumnbot.net/dashboard)!\n- Bot now removes non-verified to verify users instead of adding member. This was causing conflicts with channel permissions when updating bot permissions.\n- Updated bot from discordjs-v11 to discordjs-v12\n\n**To get regular updates on the bot\'s development, join the official [discord server](https://discord.gg/DfByvyN)!**')
            .setColor('#db583e')
            .setURL('https://discord.gg/DfByvyN')
            .setFooter(`Requested By ${msg.author.tag}`)

        msg.channel.send(help);
    }
}
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
            .setAuthor('Autumn Bot News', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.webp?size=256')
            .setDescription('This is the first major update! While only bringing one feature, its probably one of the most important features in a bot: settings!\n\n**0.0.3 Update | Settings Update**\n\n- Added `verifyChannel`, `awaitVerifyChannel`, `modVerifyChannel`, `staffRole`, `memberRole`, and `awaitVerifyRole` settings.\n- Added `-news` so those not in the discord server can receive news about the bot.\n- Fixed some bugs related to `-setup`\n- `-settings` now automatically updates the channel permissions in the server.')
            .setColor('#db583e')
            .setURL('https://discord.gg/DfByvyN')

        msg.channel.send(help);
    }
}
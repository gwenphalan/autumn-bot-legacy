const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Discord = require('discord.js')

module.exports = class ClassName extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'info',
            aliases: [],
            group: 'util',
            memberName: 'info',
            description: 'Displays a list of commands',
            details: oneLine`
                Displays a list of commands.
            `,
            examples: ['-help'],
        })
    }

    async run(msg) {
        const help = new Discord.MessageEmbed()
            .setAuthor('Autumn Bot', 'https://cdn.discordapp.com/avatars/672548437346222110/1b357ecea1cb61dbf17a74b71940d1f8.webp?size=256')
            .setTitle('How to set up Verification')
            .setDescription('Use the `-setup {staffRole} {memberRole}` command to set up verification. If you don\'t have a Staff Role or Member Role, type "create" instead of the role. The bot will create those roles for you. \n\nOnce the setup is done, there will be three new channels created: `#verify`, `#awaiting-verificaiton`, and `#mod-verify`. \n\nNew users will be able to send a verification application in `#verify`. Once they have sent their application, they will be redirected to `#awaiting-verification`, and their application will be sent to `#mod-verify`, where anyone with the staff role can accept or deny an application. \n\nIf their application is accepted, they will be given the `Member` role, otherwise they will be redirected to `#verify` where they can resubmit an application.\n\nOnce everything is setup, you can send messages in `#verify` and `#awaiting-verification` explaining what\'s going on, and as well as the application format.\n\nIf you want to change the message sent to someone when their application is verified, you can do `-settings acceptMessage "{message}"`\n**MAKE SURE TO INCLUDE THE QUOTES**')
            .setColor('#db583e')

        msg.channel.send(help);
    }
}
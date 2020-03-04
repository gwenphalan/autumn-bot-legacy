const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Discord = require('discord.js');
const client = require('../../client');

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
        const commands = client.registry.commands.array();
        console.log(commands);
    
        const help = new Discord.MessageEmbed()
            .setTitle('Help')
            .addField('<:Blank:680820567930175538>', '**Fun** [Vote For The Bot](https://top.gg/bot/672548437346222110/vote) every 12 hours to get cooler looking fun commands.')
            .addField('<:icon_red:680816713864183877> `-hug {user}`', 'Hugs the targetted user.', true)
            .addField('<:icon_red:680816713864183877> `-poke {user}`', 'Pokes the targetted user.', true)
            .addField('<:icon_red:680816713864183877> `-pat {user}`', 'Pats the targetted user\'s head.', true)
            .addField('\u200b', '\u200b')
            .addField('<:Blank:680820567930175538>', '**Utilities**')
            .addField('<:icon_red:680816713864183877> `-help`', 'Displays this menu.', true)
            .addField('<:icon_red:680816713864183877> `-info`', 'Gives info about setting up the server.', true)
            .addField('<:icon_red:680816713864183877> `-news`', 'Sends the most recent news relating to the bot.', true)
            .addField('<:Blank:680820567930175538>', '**Mod**')
            .addField('<:icon_red:680816713864183877> `-embed {channel} {title} {description} {color} {messageID - only if editting}`', 'Creates/Edits an embedded message.', true)
            .addField('<:icon_red:680816713864183877> `-settings`', 'View and edit server settings', true)
            .addField('<:icon_red:680816713864183877> `-setup`', 'Sets up the server for use with verification.', true)
            .setColor('#db583e')

        msg.channel.send(help);
    }
}
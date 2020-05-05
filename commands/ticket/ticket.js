const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const con = require('../../db.js');
const Discord = require('discord.js');
const Guild = require('../../guild.js')

module.exports = class ClassName extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'ticket',
            aliases: [],
            group: 'group',
            memberName: 'ticket',
            description: 'Create a ticket.',
            details: oneLine`
                Create a ticket.
            `,
            examples: ['-ticket'],
        })
    }

    async run(msg) {
        
    }
}
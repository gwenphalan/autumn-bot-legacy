const commando = require('discord.js-commando');
const Discord = require('discord.js');
const oneLine = require('common-tags').oneLine;
const mysql = require("mysql");

var con = mysql.createConnection({
  host: "webserver3.pebblehost.com",
  user: "autumnfo_admin",
  password: "9p4kd%DkOw96",
  database: "autumnfo_discordbot"
});

let guilds = [];

con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM guildsettings", function (err, result) {
      if (err) throw err;
      guilds = result;
    });
});

module.exports = class ClassName extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'settings',
            aliases: [],
            group: 'mod',
            memberName: 'settings',
            description: 'Sends an embeded message to the chosen channel.',
            details: oneLine`
                description
            `,
            examples: ["-embed #channel 'Title' 'This is the embeds description.' '#24fc03'"],

            args: [
                {
                    key: 'setting',
                    prompt: 'What setting would you like to view/change? (CURRENT SETTINGS: `acceptMessage`)',
                    type: 'string',
                    default: 'list'
                },
                {
                    key: 'value',
                    prompt: 'what would you like to change the setting to?',
                    type: 'string',
                    default: 'view'
                }
              ]
        })
    }

    async run(msg, { setting, value }) {
        const settings = new Discord.MessageEmbed()
            .setTitle('Settings')
            .setDescription('**The `-settings` command has been removed!** Go to https://www.autumnbot.net/dashboard to setup the Verification Module.')
            .setColor('#db583e')
        
        msg.channel.send(settings);
    }
}
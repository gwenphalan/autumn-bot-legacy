const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const DBL = require("dblapi.js");
const apiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjU0ODQzNzM0NjIyMjExMCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTgyNTk3MzQ3fQ.AOFlwDk84YGZBAdcRHSnmNYB05adjih6GRWONTR4VJk';
const Discord = require('discord.js');

const client = new commando.Client({
  owner: '279910519467671554',
  commandPrefix: '-',
  unknownCommandResponse: false
});

module.exports = class ClassName extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'hug',
            aliases: [],
            group: 'fun',
            memberName: 'hug',
            description: 'Hugs the targeted user!',
            details: oneLine`
            Hugs the targeted user!
            `,
            examples: ['-hug @Username#1234'],
            args: [
                {
                  key: 'targetUser',
                  label: 'User',
                  prompt: 'Who do you want to hug?',
                  type: 'user'
                }
              ]
        })
    }

    async run(msg, { targetUser }) {
        var name1 = msg.author.toString();
        var name2 = targetUser.toString();

        const dbl = new DBL(apiToken, client);

        dbl.hasVoted(msg.author.id).then(voted => {
            if(voted)
            {
                console.log(`${msg.author.username} hasVoted: ${voted}`);
    
                const hug = new Discord.MessageEmbed();
                
                switch (Math.round(Math.random()*5))
                {
                    case 0: 
                        hug.setColor('#f24f44');
                        break;
                    case 1: 
                        hug.setColor('#f5964e');
                        break;
                    case 2:
                        hug.setColor('#faf55f');
                        break;
                    case 3:
                        hug.setColor('#69f581');
                        break;
                    case 4:
                        hug.setColor('#52effa');
                        break;
                    case 5:
                        hug.setColor('#c95ffa');
                        break;
                }
                
                switch (Math.round(Math.random()*4))
                {
                    case 0:
                        hug.setDescription(`**${name1}** embraced **${name2}** in a tight hug!`);
                        break;
                    case 1: 
                        hug.setDescription(`**${name1}** hugged **${name2}**!`);
                        break;
                    case 2: 
                        hug.setDescription(`**${name1}** wrapped their arms around **${name2}**!`);
                        break;
                    case 3:
                        hug.setDescription(`**${name2}** got hugged by **${name1}**... wish I could get a hug...`);
                        break;
                    case 4:
                        hug.setDescription(`**${name1}** hugged **${name2}**! I ship it!`);
                        break;
                }
                
                switch (Math.round(Math.random()*2))
                {
                    case 0: 
                        hug.setThumbnail('http://www.autumnbot.net/images/hug.png');
                        break;
                    case 1: 
                        hug.setThumbnail('http://www.autumnbot.net/images/hug1.png');
                        break;
                    case 2:
                        hug.setThumbnail('http://www.autumnbot.net/images/hug2.png');
                        break;
                }
                
                if(targetUser.id == '672548437346222110')
                {
                    switch (Math.round(Math.random()*4))
                    {
                        case 0:
                            hug.setDescription(`**${name1}** hugged me! I've never had a hug before... :heart:`);
                            break;
                        case 1: 
                            hug.setDescription(`I got a hug from **${name1}**! I'm so happy!`);
                            break;
                        case 2: 
                            hug.setDescription(`**${name1}** hugged me... I think I'm in love with them!`);
                            break;
                        case 3:
                            hug.setDescription(`**${name1}** is now my best friend! They hugged me!`);
                            break;
                        case 4:
                            hug.setDescription(`**${name1}** hugged me... is this what love feels like?`);
                            break;
                    }
                }

                msg.channel.send(hug);
            }
            else
            {
                console.log(`${msg.author.username} hasVoted: ${voted}`);

                var chance = Math.round(Math.random()*4);
                console.log('Chance: ' + chance);
    
                if(chance == 1)
                {
                    msg.channel.send("**" + name1 + "** hugged **" + name2 + "**!\n\nVote for the bot at https://top.gg/bot/672548437346222110/vote to spice up this command. :eyes:")
                }
                else
                {
                    msg.channel.send("**" + name1 + "** hugged **" + name2 + "**!")
                }
            }
          msg.delete();
        })
    }
}
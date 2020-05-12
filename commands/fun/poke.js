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
            name: 'poke',
            aliases: [],
            group: 'fun',
            memberName: 'poke',
            description: 'Pokes the targeted user!',
            details: oneLine`
            Pokes the targeted user!
            `,
            examples: ['-poke @Username#1234'],
            args: [
                {
                  key: 'targetUser',
                  label: 'User',
                  prompt: 'Who do you want to poke?',
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
    
                const poke = new Discord.MessageEmbed();
                
                switch (Math.round(Math.random()*5))
                {
                    case 0: 
                        poke.setColor('#f24f44');
                        break;
                    case 1: 
                        poke.setColor('#f5964e');
                        break;
                    case 2:
                        poke.setColor('#faf55f');
                        break;
                    case 3:
                        poke.setColor('#69f581');
                        break;
                    case 4:
                        poke.setColor('#52effa');
                        break;
                    case 5:
                        poke.setColor('#c95ffa');
                        break;
                }
                
                switch (Math.round(Math.random()*4))
                {
                    case 0:
                        poke.setDescription(`**${name1}** poked **${name1}**! I didn't know this was facebook...`);
                        break;
                    case 1: 
                        poke.setDescription(`**${name1}** poked **${name2}**!`);
                        break;
                    case 2: 
                        poke.setDescription(`**${name1}** poked **${name2}** in the eye! Oh no! :persevere:`);
                        break;
                    case 3:
                        poke.setDescription(`Hey, **${name2}**! **${name1}** poked you!`);
                        break;
                    case 4:
                        poke.setDescription(`**${name1}** poked **${name2}**, I hope they used their finger...`);
                        break;
                }
                
                switch (Math.round(Math.random()*2))
                {
                    case 0: 
                        poke.setThumbnail('http://www.autumnbot.net/images/poke.png');
                        break;
                    case 1: 
                        poke.setThumbnail('http://www.autumnbot.net/images/poke1.png');
                        break;
                    case 2:
                        poke.setThumbnail('http://www.autumnbot.net/images/poke2.png');
                        break;
                }
                
                if(targetUser.id == '672548437346222110')
                {
                    switch (Math.round(Math.random()*4))
                    {
                        case 0:
                            poke.setDescription(`**${name1}** did you poke me??`);
                            break;
                        case 1: 
                            poke.setDescription(`**${name1}** poked me! What do they want?`);
                            break;
                        case 2: 
                            poke.setDescription(`**${name1}** stop poking me... it's annoying! :rolling_eyes:`);
                            break;
                        case 3:
                            poke.setDescription(`I got poked by **${name1}**... how strange!`);
                            break;
                        case 4:
                            poke.setDescription(`I can't believe you poked me there, **${name1}**!`);
                            break;
                    }
                }
    
    
                    msg.channel.send(poke);
            }
            else
            {
                console.log(`${msg.author.username} hasVoted: ${voted}`);
    
                var chance = Math.round(Math.random()*4);
                console.log('Chance: ' + chance);
    
                if(chance == 1)
                {
                    msg.channel.send("**" + name1 + "** poked **" + name2 + "**!\n\nVote for the bot at https://top.gg/bot/672548437346222110/vote to spice up this command. :eyes:")
                }
                else
                {
                    msg.channel.send("**" + name1 + "** poked **" + name2 + "**!")
                }
            }
          msg.delete();
        })
    }
}
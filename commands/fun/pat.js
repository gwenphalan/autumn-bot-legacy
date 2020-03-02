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
            name: 'pat',
            aliases: [],
            group: 'fun',
            memberName: 'pat',
            description: 'Head pats the targeted user!',
            details: oneLine`
            Hugs the targeted user!
            `,
            examples: ['-pat @Username#1234'],
            args: [
                {
                  key: 'targetUser',
                  label: 'Member',
                  prompt: 'Who do you want to headpat?',
                  type: 'member'
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
    
                const pat = new Discord.RichEmbed();
                
                switch (Math.round(Math.random()*5))
                {
                    case 0: 
                        pat.setColor('#f24f44');
                        break;
                    case 1: 
                        pat.setColor('#f5964e');
                        break;
                    case 2:
                        pat.setColor('#faf55f');
                        break;
                    case 3:
                        pat.setColor('#69f581');
                        break;
                    case 4:
                        pat.setColor('#52effa');
                        break;
                    case 5:
                        pat.setColor('#c95ffa');
                        break;
                }
                
                switch (Math.round(Math.random()*4))
                {
                    case 0:
                        pat.setDescription(`Psst... Hey, **${name2}**... **${name1}** patted your head!`);
                        break;
                    case 1: 
                        pat.setDescription(`**${name1}** patted **${name2}**'s head!`);
                        break;
                    case 2: 
                        pat.setDescription(`**${name1}** decided to pat **${name2}**'s head... so lewd!`);
                        break;
                    case 3:
                        pat.setDescription(`**${name2}** got their head patted by **${name1}**... :flushed:`);
                        break;
                    case 4:
                        pat.setDescription(`Aww! **${name1}** gave **${name2}** headpats!`);
                        break;
                }
                
                switch (Math.round(Math.random()*2))
                {
                    case 0: 
                        pat.setThumbnail('http://www.autumnbot.net/images/pat.png');
                        break;
                    case 1: 
                        pat.setThumbnail('http://www.autumnbot.net/images/pat1.png');
                        break;
                    case 2:
                        pat.setThumbnail('http://www.autumnbot.net/images/pat2.png');
                        break;
                }
    
                msg.channel.send(pat);
                msg.delete(30);
            }
            else
            {
                console.log(`${msg.author.username} hasVoted: ${voted}`);
    
                var chance = Math.round(Math.random()*5);
                console.log('Chance: ' + chance);
    
                if(chance == 1)
                {
                    msg.channel.send("**" + name1 + "** patted **" + name2 + "**'s head!\n\nVote for the bot at https://top.gg/bot/672548437346222110/vote to spice up this command. :eyes:")
                    msg.delete(30);
                }
                else
                {
                    msg.channel.send("**" + name1 + "** patted **" + name2 + "**'s head!")
                    msg.delete(30);
                }
            }
                
            if(targetUser.id == '672548437346222110')
            {
                switch (Math.round(Math.random()*4))
                {
                    case 0:
                        pat.setDescription(`**${name1}** patted my head! :flushed:`);
                        break;
                    case 1: 
                        pat.setDescription(`I got a headpat from **${name1}**! Does that mean we're dating now...?`);
                        break;
                    case 2: 
                        pat.setDescription(`**${name1}** headpat me... I've never felt these kinds of emotions before!`);
                        break;
                    case 3:
                        pat.setDescription(`**${name1}** gave me headpats!`);
                        break;
                    case 4:
                        pat.setDescription(`Thank you for the headpats, **${name1}**!`);
                        break;
                }
            }
        })
    }
}
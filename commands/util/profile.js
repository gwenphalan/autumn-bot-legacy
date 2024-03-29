const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const con = require('../../db.js');
const Discord = require('discord.js');

module.exports = class ClassName extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'profile',
            aliases: [],
            group: 'fun',
            memberName: 'profile',
            description: 'Send\'s you someone\'s profile',
            details: oneLine`
            Hugs the targeted user!
            `,
            examples: ['-profile @Username#1234'],
            args: [
                {
                  key: 'targetUser',
                  label: 'User',
                  prompt: 'Who\'s profile would you like to view?',
                  type: 'user',
                  default: 'none'
                }
              ]
        })
    }

    getProfile(userID) {
        return new Promise((resolve, reject) => {
            con.query(
                "SELECT * FROM profiles WHERE userID = '" + userID + "' LIMIT 1",
                (err, result) => {
                    return err ? reject(err) : resolve(result[0]);
                })
        })
    }

    escapeSpecialChars(jsonString) {
        return jsonString
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t")
            .replace(/\f/g, "\\f");

    }

    async run(msg, { targetUser }) {

        var noProfile = new Discord.MessageEmbed()
        .setTitle('Oh No!')
        .setColor(`#db583e`)
        

        if(targetUser == 'none')
        { 
            noProfile.setDescription(`You don't have a profile! You can set one up at https://www.autumnbot.net/profile`)
            var user = msg.author.id;
        }
        else
        {
            noProfile.setDescription(`${targetUser} doesn't have a profile! They can set one up at https://www.autumnbot.net/profile`)
            var user = targetUser.id;
        }

        var profileInfo = await this.getProfile(user);
        
        if(!profileInfo)
        {
            msg.channel.send(noProfile);
            msg.delete();
            return;
        }
        var profile = JSON.parse(this.escapeSpecialChars(profileInfo.profile));

        var profileEmbed = new Discord.MessageEmbed()
        .setAuthor('Profiles', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256')
        .setTitle(`${profile.username}#${profile.tag}`)
        .setDescription(`${profile.biography}`)
        .addField('Pronouns',profile.pronouns, true)
        .setColor(`#${profile.color}`)
        .setThumbnail(`https://cdn.discordapp.com/avatars/${profile.userID}/${profile.avatar}.png?size=512`)
        .setURL(`https://www.autumnbot.net/profile/${profile.userID}`)
        .setFooter(`Requested By ${msg.author.tag}`)

        if(profile.age != '')
        {
            profileEmbed.addField('Age',profile.age,true)
        }
        if(profile.gender != '')
        {
            profileEmbed.addField('Gender',profile.gender,true)
        }

        msg.channel.send(profileEmbed);
        msg.delete();
    }
}
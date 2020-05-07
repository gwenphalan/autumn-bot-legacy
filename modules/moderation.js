const { client } = require("../client.js");
const Discord = require('discord.js');
const con = require('../db.js');
const Guild = require('../guild.js');
const cron = require('node-cron');

console.log('MOD MODULE ON')

cron.schedule('* * * * * *', async () => {
    guilds = client.guilds.cache;

    guilds.each(async(guild) => {
        var guildOBJ = new Guild(guild.id)

        var mod = await guildOBJ.modModule()

        if(mod.enabled)
        {
            var bans = await guildOBJ.getBans();

            for(const userID in bans)
            {
                var time = bans[userID];

                if(time <= Date.now())
                {
                    guild.members.unban(userID);
                    guildOBJ.unbanUser(userID);
                }
            }
        }
    })
});

exports.moderation;
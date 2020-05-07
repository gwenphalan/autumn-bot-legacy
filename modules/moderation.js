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
                var ban = bans[userID];

                var time = ban.time;

                if(time != "infinite" && time <= Date.now())
                {
                    guild.members.unban(userID);
                    guildOBJ.unbanUser(userID);
                }
            }

            var mutedRole = mod.MutedRole;

            var mutes = await guildOBJ.getMutes();

            for(const userID in mutes)
            {
                var time = mutes[userID];

                if(time != "infinite" && time <= Date.now())
                {
                    guild.members.cache.get(userID).roles.remove(mutedRole);
                    guildOBJ.unmuteUser(userID);
                }
            }
        }
    })
});

exports.moderation;
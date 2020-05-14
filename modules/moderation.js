const { client } = require("../client.js");
const Discord = require('discord.js');
const Guild = require('../guild/guild.js');
const cron = require('node-cron');

console.log('MOD MODULE ON')

cron.schedule('*/30 * * * * *', async () => {
    guilds = client.guilds.cache;

    guilds.each(async(guild) => {
        var guildOBJ = new Guild(guild.id)

        var mod = guildOBJ.ModModule.settings;
        
        if(mod.enabled)
        {
            var bans = mod.bans;

            for(const userID in bans)
            {
                var time = bans[userID];

                if(time <= Date.now())
                {
                    guild.members.unban(userID);
                    guildOBJ.ModModule.unbanUser(userID);
                }
            }

            var mutes = mod.mutes;

            for(const userID in mutes)
            {
                var mute = mutes[userID];

                if(mute.time <= Date.now())
                {
                    guild.members.cache.get(userID).roles.remove(mod.MutedRole);
                    guildOBJ.ModModule.unmuteUser(userID);
                }
            }
        }
    })
});

exports.moderation;
const VerifyModule = require('./modules/verifyModule');
const ModModule = require('./modules/modModule');

const Cache = require('./modules/cache/cache');
const Database = require('./modules/cache/database');

class Guild 
{
    constructor(guildID)
    {
        this.VerifyModule = new VerifyModule(guildID);
        this.ModModule = new ModModule(guildID)
    }

    static addGuild(guildID)
    {
        Cache.addGuild(guildID);
        Database.addGuild(guildID);
    }

    static deleteGuild(guildID)
    {
        Cache.deleteGuild(guildID);
        Database.deleteGuild(guildID);
    }
}

module.exports = Guild;
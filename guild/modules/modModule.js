const Cache = require('./cache/cache');
const Database = require('./cache/database');

class ModModule {
    constructor(guildID) {
        this.id = guildID;
        this.settings = Cache.getMod(guildID);
    }

    getHistory(userID) {
      let mod = this.settings;
  
      let history = mod.history;
  
      if (!history) {
        history = {};
      }
  
      if (!history[userID]) {
        return {};
      }
  
      return history[userID];
    }

    warnUser(userID, warnID, reason, avatar, username, tag, staffID, staffUsername, staffAvatar, staffTag) {
        var mod = this.settings;

        if (!mod.warns) {
            mod.warns = {};
        }

        var date = Date.now() + 2592000000;

        mod.warns[warnID] =
        {
            user: userID,
            time: date,
            date: Date.now(),
            reason: reason,
            avatar: avatar,
            username: username,
            tag: tag,
            staff: {
                id: staffID,
                username: staffUsername,
                avatar: staffAvatar,
                tag: staffTag
            }
        };

        Cache.updateMod(this.id, mod);
        Database.updateGuild(this.id, "ModModule", mod);
    }

    async banUser(userID, time, reason, avatar, username, tag, staffID, staffUsername, staffAvatar, staffTag) {
        let mod = this.settings;

        if (!mod.bans) {
            mod.bans = {};
        }

        var date;

        if (time == 'infinite') {
            date = time;
        }
        else {
            date = time + Date.now();
        }

        mod.bans[userID] =
        {
            time: date,
            date: Date.now(),
            reason: reason,
            avatar: avatar,
            username: username,
            tag: tag,
            staff: {
                id: staffID,
                username: staffUsername,
                avatar: staffAvatar,
                tag: staffTag
            }
        };

        Cache.updateMod(this.id, mod);
        Database.updateGuild(this.id, "ModModule", mod);
    }

    async muteUser(userID, time, reason, avatar, username, tag, staffID, staffUsername, staffAvatar, staffTag) {
        let mod = this.settings;

        if (!mod.mutes) {
            mod.mutes = {};
        }

        var date;

        if (time == 'infinite') {
            date = time;
        }
        else {
            date = time + Date.now();
        }

        mod.mutes[userID] =
        {
            time: date,
            date: Date.now(),
            reason: reason,
            avatar: avatar,
            username: username,
            tag: tag,
            staff: {
                id: staffID,
                username: staffUsername,
                avatar: staffAvatar,
                tag: staffTag
            }
        };

        Cache.updateMod(this.id, mod);
        Database.updateGuild(this.id, "ModModule", mod);
    }

    async addHistory(userID, time, id, punishment, reason, avatar, username, tag, staffID, staffUsername, staffAvatar, staffTag) {
        let mod = this.settings;

        if (!mod.history) {
            mod.history = {};
        }

        if (!mod.history[userID]) {
            mod.history[userID] = {};
        }

        mod.history[userID]['userInfo'] = {
            userID: userID,
            avatar: avatar,
            username: username,
            tag: tag,
        }

        mod.history[userID][id] = {
            id: id,
            time: time,
            date: Date.now(),
            reason: reason,
            punishment: punishment,
            staff: {
                id: staffID,
                username: staffUsername,
                avatar: staffAvatar,
                tag: staffTag
            }
        };

        Cache.updateMod(this.id, mod);
        Database.updateGuild(this.id, "ModModule", mod);
    }

    async removeHistory(userID, id) {
        let mod = this.settings;

        if (!mod.history) {
            mod.history = {};
        }

        if (!mod.history[userID]) {
            mod.history[userID] = {};
        }

        delete mod.history[userID][id];

        Cache.updateMod(this.id, mod);
        Database.updateGuild(this.id, "ModModule", mod);
    }

    async clearHistory(userID) {
        let mod = this.settings;

        if (!mod.history) {
            mod.history = {};
        }

        if (!mod.history[userID]) {
            mod.history[userID] = {};
        }

        delete mod.history[userID];

        Cache.updateMod(this.id, mod);
        Database.updateGuild(this.id, "ModModule", mod);
    }

    async unbanUser(userID) {
        let mod = this.settings;

        delete mod.bans[userID];

        Cache.updateMod(this.id, mod);
        Database.updateGuild(this.id, "ModModule", mod);
    }

    async unmuteUser(userID) {
        let mod = this.settings;

        if (!mod.mutes) {
            mod.mutes = {};
        }

        delete mod.mutes[userID];

        Cache.updateMod(this.id, mod);
        Database.updateGuild(this.id, "ModModule", mod);
    }

    async unwarnUser(warnID) {
        let mod = this.settings;

        if (!mod.warns) {
            mod.warns = {};
        }

        delete mod.warns[warnID];

        Cache.updateMod(this.id, mod);
        Database.updateGuild(this.id, "ModModule", mod);
    }
}

module.exports = ModModule
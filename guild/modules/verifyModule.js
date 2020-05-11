const Cache = require('./cache/cache');
const Database = require('./cache/database');

class VerifyModule {
    constructor(guildID) {
        this.id = guildID;
        this.settings = Cache.getVerify(guildID);
        this.apps = Cache.getApps(guildID);
    }

    async checkApp(messageID) {
        let app = this.apps.get(messageID);

        if (app) {
            return true;
        }
        else {
            return false;
        }
    }

    async createApp(messageID, userID, messageContent) {
        let apps = this.apps;

        apps.set(messageID, { userID: userID, userApp: messageContent });

        let appsOBJ = {};

        apps.forEach(function (key, value) {
            appsOBJ[key] = value;
        })

        Cache.updateApps(this.id, apps);
        Database.updateGuild(this.id, "VerifyApps", appsOBJ);
    }

    async deleteApp(messageID) {
        let apps = this.apps;

        apps.delete(messageID);

        let appsOBJ = {};

        apps.forEach(function (key, value) {
            appsOBJ[key] = value;
        })

        Cache.updateApps(this.id, apps);
        Database.updateGuild(this.id, "VerifyApps", appsOBJ);
    }

}

module.exports = VerifyModule
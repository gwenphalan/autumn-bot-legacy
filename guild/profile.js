const Cache = require('./modules/cache/cache');
const Database = require('./modules/cache/database');

class Profile
{
    constructor(userID)
    {
        this.userID = userID
        this.settings = Cache.getProfile(userID);
    }

    updateProfile(profile)
    {
        Cache.updateProfile(this.userID, profile);
        Database.updateProfile(this.userID, profile);
    }

    static addProfile(user)
    {
        Cache.addProfile(user);
        Database.addProfile(user);
    }

    static deleteProfile(userID)
    {
        Cache.deleteProfile(userID);
        Database.deleteProfile(userID);
    }
}

module.exports = Profile;
const Database = require('./database');
const jsonConvert = require('./jsonConvert');
const Webhook = require('./webhook');

var _cache;

async function fetch() {
  const fetch = await Database.fetch()
  const profileFetch = await Database.fetchProfiles();

  let VerifyModule = new Map();
  let ModModule = new Map();
  let VerifyApps = new Map();
  let Profiles = new Map();

  profileFetch.forEach((user) => {
    Profiles.set(user.userID, jsonConvert.toOBJ(user.profile))
  })

  fetch.forEach((guild) => {
    const verifyModule = jsonConvert.toOBJ(guild.VerifyModule);
    const modModule = jsonConvert.toOBJ(guild.ModModule);
    const verifyApps = jsonConvert.toOBJ(guild.VerifyApps);

    var apps = new Map();

    for (const app in verifyApps) {
      var application =
      {
        userID: verifyApps[app].userID,
        userApp: verifyApps[app].userApp
      }

      apps.set(app, application);
    }

    VerifyModule.set(guild.Guild, verifyModule);

    ModModule.set(guild.Guild, modModule);

    VerifyApps.set(guild.Guild, apps);
  })

  _cache = {
    VerifyModule: VerifyModule,
    ModModule: ModModule,
    VerifyApps: VerifyApps,
    Profiles: Profiles
  }
}

fetch().then(console.log('DATABASE CACHED'))

class Cache {
  static async fetch() {
    const fetch = await Database.fetch()
    const profileFetch = await Database.fetchProfiles();
  
    let VerifyModule = new Map();
    let ModModule = new Map();
    let VerifyApps = new Map();
    let Profiles = new Map();
  
    profileFetch.forEach((user) => {
      ProfileMap.set(user.userID, jsonConvert.toOBJ(user.profile))
    })

    console.log(Profiles);
  
    fetch.forEach((guild) => {
      const verifyModule = jsonConvert.toOBJ(guild.VerifyModule);
      const modModule = jsonConvert.toOBJ(guild.ModModule);
      const verifyApps = jsonConvert.toOBJ(guild.VerifyApps);
  
      for (const app in verifyApps) {
        var application =
        {
          userID: verifyApps[app].userID,
          userApp: verifyApps[app].userApp
        }
  
        apps.set(app, application);
      }
  
      VerifyModule.set(guild.Guild, verifyModule);
  
      ModModule.set(guild.Guild, modModule);
  
      VerifyApps.set(guild.Guild, apps);
    })
  
    return {
      VerifyModule: VerifyModule,
      ModModule: ModModule,
      VerifyApps: VerifyApps,
      Profiles: Profiles
    }
  }

  static async cache() {
    if (!_cache) {
      _cache = this.fetch();
    }

    return _cache;
  }

  static updateVerify(guildID, verify) {
    _cache.VerifyModule.set(guildID, verify);
    Webhook.send("updateVerify", guildID, verify);
  }

  static updateMod(guildID, mod) {
    _cache.ModModule.set(guildID, mod);
    Webhook.send("updateMod", guildID, mod);
  }

  static updateApps(guildID, apps) {
    _cache.VerifyApps.set(guildID, apps);
    Webhook.send("updateApps", guildID, apps);
  }

  static updateProfile(userID, profile) {
    _cache.Profiles.set(userID, profile);
    Webhook.send("updateProfile", guildID, apps);
  }

  static webhookVerify(guildID, verify) {
    _cache.VerifyModule.set(guildID, verify);
  }

  static webhookMod(guildID, mod) {
    _cache.ModModule.set(guildID, mod);
  }

  static webhookApps(guildID, apps) {
    _cache.VerifyApps.set(guildID, apps);
  }

  static webhookProfile(userID, profile) {
    _cache.Profiles.set(userID, profile);
  }

  static getVerify(guildID) {
    return _cache.VerifyModule.get(guildID);
  }

  static getMod(guildID) {
    return _cache.ModModule.get(guildID);
  }

  static getApps(guildID) {
    return _cache.VerifyApps.get(guildID);
  }

  static getProfile(userID) {
    return _cache.Profiles.get(userID);
  }

  static addGuild(guildID) {
    _cache.VerifyApps.set(guildID, {})
    _cache.VerifyModule.set(guildID, {
      enabled: false
    })
    _cache.ModModule.set(guildID, {
      enabled: false
    })

    Webhook.send("addGuild", guildID, {});
  }

  static deleteGuild(guildID) {
    _cache.VerifyApps.delete(guildID)
    _cache.VerifyModule.delete(guildID)
    _cache.ModModule.delete(guildID)

    Webhook.send("addGuild", guildID, {});
  }

  static addProfile(user) {
    var profile = {
      userID: user.id,
      username: user.username,
      tag: user.discriminator,
      avatar: user.avatar,
      color: "f13128",
      pronouns: "n/a",
      gender: "",
      age: "",
      biography: ""
  };

    _cache.Profile.set(user.id, profile)

    Webhook.send("deleteProfile", user.id, profile);
  }

  static deleteProfile(userID) {
    _cache.Profile.delete(userID);
    Webhook.send("deleteProfile", userID, {});
  }

  static webhookAddGuild(guildID) {
    _cache.VerifyApps.set(guildID, {})
    _cache.VerifyModule.set(guildID, {
      enabled: false
    })
    _cache.ModModule.set(guildID, {
      enabled: false
    })
  }

  static webhookDeleteGuild(guildID) {
    _cache.VerifyApps.delete(guildID)
    _cache.VerifyModule.delete(guildID)
    _cache.ModModule.delete(guildID)
  }

  static webhookAddProfile(userID, profile) {
    _cache.Profile.set(userID, profile)
  }

  static webhookDeleteProfile(userID) {
    _cache.Profile.delete(userID)
  }
}

module.exports = Cache;
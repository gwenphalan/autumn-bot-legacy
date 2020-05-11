const Database = require('./database');
const jsonConvert = require('./jsonConvert');

var _cache;

async function fetch()
{
  var fetch = await Database.fetch()

  var VerifyModule = new Map();
  var ModModule = new Map();
  var VerifyApps = new Map();

  fetch.forEach((guild) => {
      let verifyModuleJSON = guild.VerifyModule;
      let modModuleJSON = guild.ModModule;
      let verifyAppsJSON = guild.VerifyApps;

      let verifyModule = jsonConvert.toOBJ(verifyModuleJSON);
      let modModule = jsonConvert.toOBJ(modModuleJSON);
      let verifyApps = jsonConvert.toOBJ(verifyAppsJSON);

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
    VerifyApps: VerifyApps
  }

  console.log(_cache)
}

fetch().then(console.log('DATABASE CACHED'))

class Cache{
    static async fetch() {
      var fetch = await Database.fetch()

      var VerifyModule = new Map();
      var ModModule = new Map();
      var VerifyApps = new Map();

      fetch.forEach((guild) => {
          let verifyModuleJSON = guild.VerifyModule;
          let modModuleJSON = guild.ModModule;
          let verifyAppsJSON = guild.VerifyApps;

          let verifyModule = jsonConvert.toOBJ(verifyModuleJSON);
          let modModule = jsonConvert.toOBJ(modModuleJSON);
          let verifyApps = jsonConvert.toOBJ(verifyAppsJSON);

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

      return {
        VerifyModule: VerifyModule,
        ModModule: ModModule,
        VerifyApps: VerifyApps
      }
    }
    
    static async cache()
    {
      if(!_cache)
      {
        _cache = this.fetch();
      }

      return _cache;
    }

    static updateVerify(guildID, verify)
    {
      _cache.VerifyModule.set(guildID, verify);
    }

    static updateMod(guildID, mod)
    {
      _cache.ModModule.set(guildID, mod);
    }

    static updateApps(guildID, apps)
    {
      _cache.VerifyApps.set(guildID, apps);
    }

    static getVerify(guildID)
    {
      return _cache.VerifyModule.get(guildID);
    }

    static getMod(guildID)
    {
      return _cache.ModModule.get(guildID);
    }

    static getApps(guildID)
    {
      return _cache.VerifyApps.get(guildID);
    }

    static addGuild(guildID)
    {
      _cache.VerifyApps.set(guildID, {})
      _cache.VerifyModule.set(guildID, {
        enabled: false
      })
      _cache.ModModule.set(guildID, {
        enabled: false
      })
    }

    static deleteGuild(guildID)
    {
      _cache.VerifyApps.delete(guildID)
      _cache.VerifyModule.delete(guildID)
      _cache.ModModule.delete(guildID)
    }
}

module.exports = Cache;
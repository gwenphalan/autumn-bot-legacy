const con = require(__dirname + "/db.js");
const { client } = require(__dirname + "/client.js");
const express = require("express");
const { catchAsync } = require(__dirname + "/utils.js");
const bodyParser = require("body-parser");
const jsonConvert = require("./jsonConvert");

var router = express.Router();
router.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
router.use(bodyParser.json());

function escapeSpecialChars(jsonString) {
  return jsonString
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\f/g, "\\f");
}

async function getGuildInfo(id) {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM guildsettings WHERE Guild = '" + id + "' LIMIT 1",
      (err, result) => {
        return err ? reject(err) : resolve(result);
      }
    );
  });
}

async function fetchCache() {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM guildsettings", (err, result) => {
      return err ? reject(err) : resolve(result);
    });
  });
}

var cache;

var appCache;

async function run() {
  var fetch = await fetchCache();

  var map = new Map();
  var appMap = new Map();

  fetch.forEach((guild) => {
    let verifyModuleJSON = guild.VerifyModule;
    let modModuleJSON = guild.ModModule;
    let verifyAppsJSON = guild.VerifyApps;

    console.log(verifyModuleJSON);
    console.log(modModuleJSON);
    console.log(verifyAppsJSON);

    let verifyModule = jsonConvert.toOBJ(verifyModuleJSON);
    let modModule = jsonConvert.toOBJ(modModuleJSON);
    let verifyApps = jsonConvert.toOBJ(verifyAppsJSON);

    var settings = {
      VerifyModule: verifyModule,
      ModModule: modModule,
    };

    var apps = new Map();

    for (const app in verifyApps) {
      var application = {
        userID: verifyApps[app].userID,
        userApp: verifyApps[app].userApp,
      };

      apps.set(app, application);
    }

    appMap.set(guild.Guild, apps);

    map.set(guild.Guild, settings);
  });

  cache = map;
  appCache = appMap;

  console.log("DATABASE CACHED");
}

run();

router.post(
  "/api/update/:guildID/:module",
  catchAsync(async function (req, res) {
    var settings = cache.get(req.params.guildID);
    if (req.params.module == "verification") {
      settings.VerifyModule = req.body;
    }
    cache.set(req.params.guildID, settings);
    console.log(req.body);
    res.send("Webhook Received");
  })
);

async function setGuildInfo(id, column, value) {
  return new Promise((resolve, reject) => {
    con.query(
      `UPDATE guildsettings SET ${column} = '${value}' WHERE Guild = ${id}`,
      (err, result) => {
        console.log(`Update ${result.affectedRows} row(s)`);
        return err ? reject(err) : resolve(result);
      }
    );
  });
}

class Guild {
  constructor(guildID) {
    this.guildID = guildID;
  }

  get info() {
    const cacheInfo = client.guilds.cache.get(this.guildID);
    if (!cacheInfo) this.cacheGuild();
    return client.guilds.cache.get(this.guildID);
  }

  get ModModule() {
    const cacheInfo = client.guilds.cache.get(this.guildID);
    if (!cacheInfo) this.cacheGuild();
    return cache.get(this.guildID).ModModule;
  }

  get VerifyModule() {
    const cacheInfo = client.guilds.cache.get(this.guildID);
    if (!cacheInfo) this.cacheGuild();
    return cache.get(this.guildID).VerifyModule;
  }

  get apps() {
    const cacheInfo = client.guilds.cache.get(this.guildID);
    if (!cacheInfo) this.cacheGuild();
    return appCache.get(this.guildID);
  }

  async cacheGuild() {
    cache.set(this.guildID, {
      VerifyModule: {
        enabled: false,
      },
      ModModule: {
        enabled: false,
      },
    });

    appCache.set(this.guildID, {});
  }

  async updateModule(moduleName, obj) {
    var sql = `INSERT INTO guildsettings (Guild, VerifyModule, ModModule, VerifyApps) VALUES ('${guild.id}', '{"enabled":false}', '{"enabled":false}', '{}')`;
    const dbInfo = getGuildInfo(this.id);
    if (!dbInfo)
      return con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    return setGuildInfo(this.guildID, moduleName, jsonConvert.toJSON(obj));
  }

  async getApps() {
    let guild = await getGuildInfo(this.guildID);

    if (!guild[0]) return null;

    let verifyModuleJSON = guild[0].VerifyApps;

    let verifyModule = JSON.parse(escapeSpecialChars(verifyModuleJSON));

    return verifyModule;
  }

  async updateApps(apps) {
    var sql = `INSERT INTO guildsettings (Guild, VerifyModule, ModModule, VerifyApps) VALUES ('${guild.id}', '{"enabled":false}', '{"enabled":false}', '{}')`;
    const dbInfo = getGuildInfo(this.id);
    if (!dbInfo)
      return con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    var result = await setGuildInfo(
      this.guildID,
      "VerifyApps",
      jsonConvert.toJSON(apps)
    );

    return result;
  }

  async checkApp(messageID) {
    var apps = appCache.get(this.guildID);

    let app = apps ? apps.get(messageID) : null;

    if (app) {
      return true;
    } else {
      return false;
    }
  }

  async createApplication(messageID, userID, messageContent) {
    let apps = await this.getApps();

    var apps1 = appCache.get(this.guildID);

    apps1.set(messageID, { userID: userID, userApp: messageContent });

    appCache.set(this.guildID, apps1);

    apps[messageID] = { userID: userID, userApp: messageContent };

    this.updateApps(apps);
  }

  async deleteApplication(messageID) {
    let apps = await this.getApps();

    var apps1 = appCache.get(this.guildID);

    delete apps[messageID];

    apps1.delete(messageID);

    appCache.set(this.guildID, apps1);

    this.updateApps(apps);
  }

  async banUser(userID, username, tag, time) {
    let mod = this.ModModule;

    if (!mod.bans) {
      mod.bans = {};
    }

    var date;

    if (time == "infinite") {
      date = time;
    } else {
      date = time + Date.now();
    }

    let bans = mod.bans;

    bans[userID] = {
      time: date,
      username: username,
      discriminator: tag,
    };

    var settings = cache.get(this.guildID);

    settings.ModModule = mod;

    cache.set(this.guildID, settings);

    await setGuildInfo(this.guildID, "ModModule", jsonConvert.toJSON(mod));
  }

  async unbanUser(userID) {
    let mod = await this.modModule();
    username, tag;
    delete bans[userID];

    var settings = cache.get(this.guildID);

    settings.ModModule = mod;

    cache.set(this.guildID, settings);

    setGuildInfo(this.guildID, "ModModule", jsonConvert.toJSON(mod));
  }

  async muteUser(userID, time, reason, avatar, username, tag) {
    let mod = await this.modModule();

    if (!mod.mutes) {
      mod.mutes = {};
    }

    let mutes = mod.mutes;

    var date;

    if (time == "infinite") {
      date = time;
    } else {
      date = time + Date.now();
    }

    mutes[userID] = {
      time: date,
      date: Date.now(),
      reason: reason,
      avatar: avatar,
      username: username,
      tag: tag,
    };

    var settings = cache.get(this.guildID);

    settings.ModModule = mod;

    cache.set(this.guildID, settings);

    setGuildInfo(this.guildID, "ModModule", jsonConvert.toJSON(mod));
  }

  async warnUser(userID, warnID, reason, avatar, username, tag) {
    let mod = await this.modModule();

    if (!mod.warns) {
      mod.warns = {};
    }

    let warns = mod.warns;

    var date = Date.now() + 2592000000;

    warns[warnID] = {
      user: userID,
      time: date,
      date: Date.now(),
      reason: reason,
      avatar: avatar,
      username: username,
      tag: tag,
    };

    var settings = cache.get(this.guildID);

    settings.ModModule = mod;

    cache.set(this.guildID, settings);

    setGuildInfo(this.guildID, "ModModule", jsonConvert.toJSON(mod));
  }

  async unmuteUser(userID) {
    let mod = await this.modModule();

    if (!mod.mutes) {
      mod.mutes = {};
    }

    let mutes = mod.mutes;

    delete mutes[userID];

    await setGuildInfo(this.guildID, "ModModule", jsonConvert.toJSON(mod));
  }

  async getBans() {
    let mod = await this.modModule();

    if (!mod.bans) {
      mod.bans = {};
    }

    let bans = mod.bans;

    return bans;
  }

  async getMutes() {
    let mod = await this.modModule();

    if (!mod.mutes) {
      mod.mutes = {};
    }

    let mutes = mod.mutes;

    return mutes;
  }

  async getWarns() {
    let mod = await this.modModule();

    if (!mod.warns) {
      mod.warns = {};
    }

    let warns = mod.warns;

    return warns;
  }
}

module.exports = {
  Guild: Guild,
  router: router,
};

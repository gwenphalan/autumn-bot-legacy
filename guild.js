const con = require(__dirname + '/db.js');
const { client } = require(__dirname + "/client.js");

function escapeSpecialChars(jsonString) {
  return jsonString
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\f/g, "\\f");
}

async function getGuildInfo(id)
{
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM guildsettings WHERE Guild = '" + id + "' LIMIT 1", 
      (err, result) => {
        return err ? reject(err) : resolve(result);
      })
  })
}

async function setGuildInfo(id, column, value)
{
  return new Promise((resolve, reject) => {
    con.query(
      `UPDATE guildsettings SET ${column} = '${value}' WHERE Guild = ${id}`, 
      (err, result) => {
        console.log(`Update ${result.affectedRows} row(s)`)
        return err ? reject(err) : resolve(result);
      })
  })
}

function stringify(obj)
{


  var final = JSON.stringify(obj);

  var a = 0;
  var count = 0;
  for (a = 0; a < JSON.stringify(obj).length; a++) {
      if (JSON.stringify(obj).charAt(a) == "'") {
          final = [final.slice(0, a + count), '\\', final.slice(a + count)].join('');
          count++;

      }
  }
  return final;
}

module.exports = class Guild
{
  constructor (guildID)
  {
    this.guildID = guildID;
  }
  
  get info()
  {
    return client.guilds.cache.get(this.guildID);
  }

  async updateModule(moduleName, obj)
  {
    return setGuildInfo(this.guildID, moduleName, stringify(obj))
  }
  
  async verifyModule()
  {
    let guild = await getGuildInfo(this.guildID);
    
    if(!guild[0]) return null;

    let verifyModuleJSON = guild[0].VerifyModule;

    let verifyModule = JSON.parse(escapeSpecialChars(verifyModuleJSON));
    
    return verifyModule;
  }

  async modModule()
  {
    let guild = await getGuildInfo(this.guildID);
    
    if(!guild[0]) return null;

    let verifyModuleJSON = guild[0].ModModule;

    let verifyModule = JSON.parse(escapeSpecialChars(verifyModuleJSON));
    
    return verifyModule;
  }

  async getApps()
  {
    let guild = await getGuildInfo(this.guildID);
    
    if(!guild[0]) return null;

    let verifyModuleJSON = guild[0].VerifyApps;

    let verifyModule = JSON.parse(escapeSpecialChars(verifyModuleJSON));
    
    return verifyModule;
  }

  async updateApps(apps)
  {
    var result = await setGuildInfo(this.guildID, "VerifyApps", stringify(apps));

    return result;
  }

  async checkApp(messageID)
  {
    let apps = await this.getApps();

    let app = apps[messageID];

    if(app)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  async createApplication(messageID, userID, messageContent)
  {
    let apps = await this.getApps();

    apps[messageID] = {"userID": userID, "userApp": messageContent};

    this.updateApps(apps);
  }

  async deleteApplication(messageID)
  {
    let apps = await this.getApps();

    delete apps[messageID]

    this.updateApps(apps);
  }

  async banUser(userID, username, tag, time)
  {
    let mod = await this.modModule();

    if(!mod.bans)
    {
      mod.bans = {};
    }

    var date;

    if(time == 'infinite')
    {
      date = time;
    }
    else{
      date = time + Date.now();
    }

    let bans = mod.bans;

    bans[userID] = 
    {
      "time": date,
      "username": username,
      "discriminator": tag
    };

    await setGuildInfo(this.guildID, "ModModule", stringify(mod));
  }

  async unbanUser(userID)
  {
    let mod = await this.modModule();
    username, tag
    delete bans[userID];

    setGuildInfo(this.guildID, "ModModule", stringify(mod));
  }

  async muteUser(userID, time, reason, avatar, username, tag)
  {
    let mod = await this.modModule();

    if(!mod.mutes)
    {
      mod.mutes = {};
    }

    let mutes = mod.mutes;

    var date;

    if(time == 'infinite')
    {
      date = time;
    }
    else{
      date = time + Date.now();
    }

    mutes[userID] = 
    {
      time: date,
      date: Date.now(),
      reason: reason,
      avatar: avatar,
      username: username, 
      tag: tag
    };

    setGuildInfo(this.guildID, "ModModule", stringify(mod));
  }

  async unmuteUser(userID)
  {
    let mod = await this.modModule();

    if(!mod.mutes)
    {
      mod.mutes = {};
    }

    let mutes = mod.mutes;

    delete mutes[userID];

    await setGuildInfo(this.guildID, "ModModule", stringify(mod));
  }

  async getBans()
  {
    let mod = await this.modModule();

    return mod.bans;
  }

  async getMutes()
  {
    let mod = await this.modModule();

    return mod.mutes;
  }
}
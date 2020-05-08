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
        return err ? reject(err) : resolve(result);
      })
  })
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
  
  async verifyModule()
  {
    let guild = await getGuildInfo(this.guildID);
    
    if(!guild[0]) return null;

    let verifyModuleJSON = guild[0].VerifyModule;

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
    var final = JSON.stringify(apps);

    var a = 0;
    var count = 0;
    for (a = 0; a < JSON.stringify(apps).length; a++) {
        if (JSON.stringify(apps).charAt(a) == "'") {
            final = [final.slice(0, a + count), '\\', final.slice(a + count)].join('');
            count++;

        }
    }

    var result = await setGuildInfo(this.guildID, "VerifyApps", final);

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
    console.log(`Creating Application...\nGuild: ${this.guildID}\nmessageID: ${messageID}\nuserID: ${userID}\nmessageContent:'${messageContent}'`)

    let apps = await this.getApps();

    apps[messageID] = {"userID": userID, "userApp": messageContent};

    var result = this.updateApps(apps);

    return result;
  }

  async deleteApplication(messageID)
  {
    console.log(`Deleting Application...\nGuild: ${this.guildID}\nmessageID: ${messageID}`)

    let apps = await this.getApps();

    delete apps[messageID]

    this.updateApps(apps);
  }
}
const con = require(__dirname + '/db.js');
const client = require(__dirname + "/client.js");

function escapeSpecialChars(jsonString) {
  return jsonString
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\f/g, "\\f");

}

class Guild
{
  constructor(guildID)
  {
    this.guildID = guildID;
  }
  
  get info()
  {
    return client.guilds.find(guild => guild.id === this.guildID);
  }
  
  async getVerifyModule()
  {
    return(async() => {
    let guild = await this.getGuildInfo()

    let verifyModuleJSON = guild[0].VerifyModule;

    let verifyModule = JSON.parse(escapeSpecialChars(verifyModuleJSON));
    
    return verifyModule;
    })
  }
  
  async modModule()
  {
    return(async() => {
    let guild = await this.getGuildInfo()

    let modModuleJSON = guild[0].ModModule;

    let modModule = JSON.parse(escapeSpecialChars(modModuleJSON));
    
    return modModule;
    })
  }
  
  async getGuildInfo()
  {
    return new Promise((resolve, reject) => {
      con.query(
        "SELECT * FROM guildsettings WHERE Guild = '" + this.guildID + "' LIMIT 1", 
        (err, result) => {
          return err ? reject(err) : resolve(result);
        })
    })
  }
}

exports.guild = {
  Guild: Guild
}
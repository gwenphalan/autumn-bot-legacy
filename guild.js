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
  
  async modModule()
  {
    let guild = await getGuildInfo(this.guildID);
    
    if(!guild[0]) return null;

    let modModuleJSON = guild[0].ModModule;

    let modModule = JSON.parse(escapeSpecialChars(modModuleJSON));
    
    return modModule;
  }
}
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
  
  async ticketModule()
  {
    let guild = await getGuildInfo(this.guildID);
    
    if(!guild[0]) return null;

    let ticketModuleJSON = guild[0].TicketModule;

    let ticketModule = JSON.parse(escapeSpecialChars(ticketModuleJSON));
    
    return modModule;
  }

  async updateTicketModule(module)
  {
    var final = JSON.stringify(module);

    var a = 0;
    var count = 0;
    for (a = 0; a < JSON.stringify(module).length; a++) {
        if (JSON.stringify(module).charAt(a) == "'") {
            final = [final.slice(0, a + count), '\\', final.slice(a + count)].join('');
            count++;

        }
    }
  }

  async addTicket(userID, channelID)
  {
    let ticketModule = await this.ticketModule();

    let ticket = 
    {
      "user": userID,
      "channel": channelID,
      "status": "open"
    }

    ticketModule.tickets.push(ticket);

    this.updateTicketModule(ticketModule)
  }
}
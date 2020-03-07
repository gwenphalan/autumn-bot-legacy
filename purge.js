const con = require(__dirname + '/db.js');
const { client } = require(__dirname + '/client.js')

const guilds = client.guilds.cache;

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

async function getAllGuilds()
{
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM guildsettings", 
      (err, result) => {
        return err ? reject(err) : resolve(result);
      })
  })
}

async function checkDB(guild)
{
    return new Promise((resolve, reject) => {
      con.query(
        "SELECT * FROM guildsettings WHERE Guild = '" + guild.id + "' LIMIT 1", 
        (err, result) => {
          return err ? reject(err) : resolve(result);
        })
    })
}

client.on("ready", async function(){
    console.log("STARTING DATABASE REPEAT SEARCH");
    
    let DBguilds = await getAllGuilds();
    
    console.log(DBguilds.length);

    let guildsArray = guilds.array();

    console.log(guildsArray.length);

    for(var i = 0; i < guildsArray.length; i++)
    {
        let getDB = await checkDB(guildsArray[i]);

        if(getDB[0]) console.log(`${guildsArray[i].name} ALREADY HAS A DATABASE ENTRY`);
        if(!getDB[0]){
            console.log(false);
            var sql = `INSERT INTO guildsettings (Guild, VerifyModule) VALUES ('${guildsArray[i].id}', '{"enabled":false}')`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log(`CREATED DATABASE ENTRY FOR ${guildsArray[i].name}`);
            });
        };
    }
});
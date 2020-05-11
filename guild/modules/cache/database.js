const mysql = require('mysql');
const jsonConvert = require('./jsonConvert');

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    charset: 'utf8mb4'
});

con.connect(function (err) {
    if (err) throw err;
    console.log(`Connect To Database ${process.env.DB_DATABASE}`)
});

class Database {
    static async fetch() {
        return new Promise((resolve, reject) => {
            con.query(
                "SELECT * FROM guildsettings",
                (err, result) => {
                    return err ? reject(err) : resolve(result);
                })
        })
    }

    static async updateGuild(guildID, column, obj) {
        var validColumns = ["VerifyModule", "ModModule", "VerifyApps"];

        if (!validColumns.includes(column)) {
            throw new Error(`Invalid Database Column: ${column}`);
        }

        var value = jsonConvert.toJSON(obj);

        return new Promise((resolve, reject) => {
            con.query(
                `UPDATE guildsettings SET ${column} = '${value}' WHERE Guild = ${guildID}`,
                (err, result) => {
                  return err ? reject(err) : resolve(result);
                })
          })
    }

    static async addGuild(guildID) {
        var sql = `INSERT INTO guildsettings (Guild, VerifyModule, ModModule, VerifyApps) VALUES ('${guildID}', '{"enabled":false}', '{"enabled":false}', '{}')`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        })
    }

    static async deleteGuild(guildID)
    {
        var sql = `DELETE FROM guildsettings WHERE Guild = '${guildID}'`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Number of records deleted: " + result.affectedRows);
        })
    }
}

module.exports = Database
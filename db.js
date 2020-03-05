const mysql = require('mysql');

var con = mysql.createConnection({
  host: "webserver3.pebblehost.com",
  user: "autumnfo_admin",
  password: "9p4kd%DkOw96",
  database: "autumnfo_discordbot"
});

con.connect(function(err) {
    if (err) throw err;
    console.log('CONNECTED TO DATABASE')
});

module.exports = con;
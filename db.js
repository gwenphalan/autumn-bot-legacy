const mysql = require('mysql');

const settings = require(__dirname + '/settings/settings.js');

if(settings.beta)
{
  var database = settings.db_beta_database;
}
else
{
  var database = settings.db_database;
}

var con = mysql.createConnection({
  host: settings.db_host,
  user: settings.db_user,
  password: settings.db_password,
  database: database,
  charset : 'utf8mb4'
});

con.connect(function(err) {
    if (err) throw err;
    console.log('CONNECTED TO DATABASE')
});

module.exports = con;
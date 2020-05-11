const fs = require('fs');

let rawdata = fs.readFileSync(__dirname + '/settings.json');
let settings = JSON.parse(rawdata);

let _settings = {
    bot_token: settings.beta ? settings.beta_settings.bot_token : settings.bot_token,
    bot_owner: settings.bot_owner,
    bot_prefix: settings.bot_prefix,
    bot_support_invite: settings.bot_support_invite,
    db_host: settings.db_host,
    db_user: settings.db_user,
    db_password: settings.db_password,
    db_database: settings.beta ? settings.beta_settings.db_database : settings.db_database,
    dbl_api_token: settings.dbl_api_token
};

console.log('SETTINGS REGISTERED')
console.log(_settings);

module.exports = _settings;
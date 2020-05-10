const commando = require('discord.js-commando');
const sqlite = require('sqlite');
const path = require('path');
const MySQL = require('mysql2/promise');
const MySQLProvider = require(__dirname + '/discord.js-commando-mysqlprovider');
const oneLine = require('common-tags').oneLine;
const DBL = require("dblapi.js");

const settings = require(__dirname + '/settings/settings.js');

const client = new commando.Client({
  owner: settings.bot_owner,
  commandPrefix: settings.bot_prefix,
  invite: settings.bot_support_invite,
  partials: ['MESSAGE', 'REACTION']
});

const dbl = new DBL(settings.dbl_api_token, client);

if (settings.beta) {
  var token = settings.beta_token;
}
else {
  var token = settings.bot_token;
}

client.on("ready", () => {
  console.log("Loading...");
  let interval = setInterval(() => {
    if (typeof database !== "object" || typeof guilds !== "object") return;
    console.log("I'm online!");
    clearInterval(interval);
  }, 100);
  setInterval(() => {
    dbl.postStats(client.guilds.size);
  }, 1800000);
});

client
  .on('error', console.error)
  .on('warn', console.warn)
  .on('debug', console.log)
  .on('ready', async function () {
    client.user.setStatus('available')
    await client.user.setPresence({
      activity: {
        name: client.guilds.cache.size + ' servers | -news',
        type: "LISTENING",
      }
    }).then(() => console.log('Status Set'));
    console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
  })
  .on('disconnect', () => { console.warn('Disconnected!'); })
  .on('reconnecting', () => { console.warn('Reconnecting...'); })
  .on('commandError', (cmd, err) => {
    if (err instanceof commando.FriendlyError) return;
    console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
  })
  .on('commandBlocked', (msg, reason) => {
    console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
  })
  .on('commandPrefixChange', (guild, prefix) => {
    console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('commandStatusChange', (guild, command, enabled) => {
    console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('groupStatusChange', (guild, group, enabled) => {
    console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  });

client.registry
  .registerGroup('mod', 'Mod')
  .registerGroup('fun', 'Fun')
  .registerDefaultGroups()
  .registerDefaultTypes()
  .registerDefaultCommands({ help: false, eval: false, unknownCommand: false })
  .registerTypesIn(path.join(__dirname, 'types'))
  .registerCommandsIn(path.join(__dirname, 'commands'));

if (settings.beta) {
  var database = settings.db_beta_database;
}
else {
  var database = settings.db_database;
}

MySQL.createConnection({
  host: settings.db_host,
  user: settings.db_user,
  password: settings.db_password,
  database: database,
  charset: 'utf8mb4'
}).then((db) => {
  client.setProvider(new MySQLProvider(db));
  client.login(token);
});

exports.client = client;

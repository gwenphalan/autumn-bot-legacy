const commando = require('discord.js-commando');
const sqlite = require('sqlite');
const path = require('path');

const client = new commando.Client({
  owner: '279910519467671554',
  commandPrefix: '-',
  invite: 'https://discord.gg/DfByvyN'
});

const token = 'NjczNDI0MTkzODYxMTg5NjYx.Xl-2dQ.qtGlbtkjRAV1ujV9kShpUkgnNjU';

client.setProvider(
  sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new commando.SQLiteProvider(db))
).catch(console.error);

client.on("ready", () => {
  console.log("Loading...");
  let interval = setInterval(() => {
    if (typeof database !== "object" || typeof guilds !== "object") return;
    console.log("I'm online!");
    clearInterval(interval);
  }, 100);
});

client
  .on('error', console.error)
  .on('warn', console.warn)
  .on('debug', console.log)
  .on('ready', async function(){
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
  .registerDefaultCommands({ help: false, eval: false, unknownCommand: false})
  .registerTypesIn(path.join(__dirname, 'types'))
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(token);

exports.client = client;
# MySQLProvider for Discord.js-Commando
Uses an MySQL database to store settings with guilds, for use with MySQL or MariaDB (recommended). It requires the `mysql2` npm package - making the connection is up to you.

# Installation
```
npm install discord.js-commando-mysqlprovider
```

# Usage (Example)
```js
const Commando = require('discord.js-commando');
const MySQL = require('mysql2/promise');
const MySQLProvider = require('discord.js-commando-mysqlprovider');

const client = new Commando.CommandoClient(ClientOptions);
MySQL.createConnection({
    host: 'mysql-host',
    user: 'mysql-user',
    password: 'mysql-user-pw',
    database: 'mysql-db'
}).then((db) => {
    client.setProvider(new MySQLProvider(db));
    client.login('YOUR-BOT-TOKEN');
});
```

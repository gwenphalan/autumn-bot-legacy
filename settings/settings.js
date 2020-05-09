const fs = require('fs');

let rawdata = fs.readFileSync(__dirname + '/settings.json');
let settings = JSON.parse(rawdata);

console.log('SETTINGS REGISTERED')
console.log(settings);

module.exports = settings;
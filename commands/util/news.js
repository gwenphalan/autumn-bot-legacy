const commando = require("discord.js-commando");
const oneLine = require("common-tags").oneLine;
const Discord = require("discord.js");

module.exports = class ClassName extends commando.Command {
  constructor(client) {
    super(client, {
      name: "news",
      aliases: [],
      group: "util",
      memberName: "news",
      description: "Displays recent bot news",
      details: oneLine`
                Displays recent bot news.
            `,
      examples: ["-help"],
    });
  }

  async run(msg) {
    const help = new Discord.MessageEmbed()
      .setAuthor(
        "News",
        "https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256"
      )
      .setDescription(
        "Recently the bot has seen some major downtime, this is due to rate limiting from the discord API. I am currently rewriting the entire bot. Hopefully the more efficient code will bring a better experience with Autumn Bot. The new bot will be entirely command based, with the dashboard as an option. The new dashboard, however, will not be released for sometime. If you have any questions, feel free to join the support server.\n\n**To get regular updates on the bot's development, join the official [discord server](https://discord.gg/DfByvyN)!**"
      )
      .setColor("#db583e")
      .setURL("https://discord.gg/DfByvyN")
      .setFooter(`Requested By ${msg.author.tag}`);

    msg.channel.send(help);
  }
};

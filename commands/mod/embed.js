const commando = require("discord.js-commando");
const Discord = require("discord.js");
const oneLine = require("common-tags").oneLine;

module.exports = class ClassName extends commando.Command {
  constructor(client) {
    super(client, {
      name: "embed",
      aliases: [],
      group: "mod",
      memberName: "embed",
      description: "Sends an embeded message to the chosen channel.",
      details: oneLine`
                description
            `,
      examples: [
        "-embed #channel 'Title' 'This is the embeds description.' '#24fc03'",
      ],

      args: [
        {
          key: "channel",
          prompt:
            "What channel would you like to send the embedded message to?",
          type: "channel",
        },
        {
          key: "title",
          prompt: "What would you like the title to be?",
          type: "string",
        },
        {
          key: "desc",
          prompt: "What would you like the description to say?",
          type: "string",
        },
        {
          key: "color",
          prompt: "What color would you like the embed to be?",
          type: "string",
        },
        {
          key: "messageId",
          prompt: "If you are editting an embed, what is its message ID?",
          type: "string",
          default: "new",
        },
      ],
    });
  }

  async run(msg, { channel, title, desc, color, messageId }) {
    if (
      !msg.member.hasPermission("ADMINISTRATOR") &&
      msg.author.id != "279910519467671554"
    ) {
      msg
        .reply("You don't have the `ADMINISTRATOR` permission!")
        .then(function (msg) {
          msg.delete(10000);
        });
      msg.delete();
      return;
    }

    const embed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle(title)
      .setAuthor(msg.author.username, msg.author.displayAvatarURL())
      .setDescription(desc);

    const created = new Discord.MessageEmbed()
      .setColor("#db583e")
      .setAuthor(
        "Custom Embed",
        "https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=128"
      )
      .setTitle("Embed Created!");

    const editted = new Discord.MessageEmbed()
      .setColor("#db583e")
      .setAuthor(
        "Custom Embed",
        "https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=128"
      )
      .setTitle("Embed Editted!");

    if (messageId === "new") {
      channel.send(embed);

      msg.channel.send(created);
    } else {
      channel.messages
        .fetch({ around: messageId, limit: 1 })
        .then((msg) => {
          const fetchedMsg = msg.first();
          fetchedMsg.edit(embed);
        })
        .catch(console.error);
      msg.channel.send(editted);
    }
  }
};

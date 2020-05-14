const commando = require("discord.js-commando");
const oneLine = require("common-tags").oneLine;
const timestring = require("timestring");
const prettyMs = require("pretty-ms");
const Guild = require("../../guild/guild.js");
const Discord = require("discord.js");

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function memberFilterInexact(search) {
  return (mem) =>
    mem.user.username.toLowerCase().includes(search.toLowerCase()) ||
    (mem.nickname &&
      mem.nickname.toLowerCase().includes(search.toLowerCase())) ||
    `${mem.user.username.toLowerCase()}#${mem.user.discriminator}`.includes(
      search.toLowerCase()
    ) ||
    search.includes(mem.user.id);
}

module.exports = class ClassName extends commando.Command {
  constructor(client) {
    super(client, {
      name: "kick",
      aliases: [],
      group: "mod",
      memberName: "kick",
      description: "Kicks the targetted user",
      details: oneLine`
            Kicks the targetted user
            `,
      examples: ['-ban @user#1234 30m "Annoying"'],

      args: [
        {
          key: "member",
          prompt: "Who would you like to kick?",
          type: "string",
          default: "",
        },
        {
          key: "reason",
          prompt: "Why are you banning kick?",
          type: "string",
          default: "No Reason Given",
        },
      ],
    });
  }

  async run(msg, { member, reason }) {
    var guild = new Guild(msg.guild.id);

    var mod = guild.ModModule.settings;

    if (mod.enabled == false) return;

    if (!msg.member.roles.cache.has(mod.StaffRole)) {
      msg.channel.send("You do not have permission to run this command!");
      return;
    }

    //Member Search & Errors

    if (member === "") {
      var d = new Discord.MessageEmbed()
        .setTitle("ERROR: `No Member Provided`")
        .setDescription(
          `**Command Usage**\n-kick {member} {reason \`optional\`}\n\n **Example**\n\`-mute @Username#0000 10m Spam\``
        );
      msg.channel.send(d);
      return;
    }

    var members = msg.guild.members.cache;

    var result = members.filter(memberFilterInexact(member));

    var user = result.first();

    if (result.size > 1) {
      var str = "";

      result.each((user) => (str += ` • <@!${user.id}>\n`));

      var a = new Discord.MessageEmbed()
        .setTitle("Uh Oh!")
        .setDescription(
          `Multiple members found, please try again (and be more specific)!\n${str}`
        );
      msg.channel.send(a);
      return;
    } else if (!result.size) {
      var c = new Discord.MessageEmbed()
        .setTitle(`ERROR: \`Invalid User '${member}'\``)
        .setDescription(
          `**Command Usage**\n-warn {member} {reason \`optional\`}\n\n **Example**\n\`-mute @Username#0000 10m Spam\``
        );
      msg.channel.send(c);
      return;
    }

    //------------------------------------

    if (
      !user.bannable ||
      user.roles.cache.first().position >
        msg.member.roles.cache.first().position
    ) {
      msg.channel.send(`You cannot warn this user!`);
      return;
    }

    var id;

    var idIsUnique = false;

    var history = guild.ModModule.getHistory(user.id);

    while (!idIsUnique) {
      id = makeid(5);
      if (!history[id]) idIsUnique = true;
    }

    var response = new Discord.MessageEmbed()
      .setAuthor(
        "Moderation",
        "https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256"
      )
      .setTitle(`${user.user.tag} has been kicked!`)
      .setDescription(`**Reason:** ${reason}\n`)
      .setThumbnail(
        user.user.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 512,
        })
      )
      .setColor(`#db583e`)
      .setFooter(
        `Kicked By ${msg.author.username} | ID: ${id}`,
        msg.author.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 512,
        })
      )
      .setTimestamp();

    msg.channel.send(response);

    if (mod.ModLogEnabled) {
      var modlog = msg.guild.channels.cache.get(mod.ModLog);

      var log = new Discord.MessageEmbed()
        .setAuthor(
          "Moderation",
          "https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=256"
        )
        .setTitle(`User Kicked`)
        .setDescription(
          ` • **ID:** ${id}\n` +
            ` • **User:** ${user}\n` +
            ` • **Kicked By:** ${msg.author}\n` +
            ` • **Reason:** ${reason}\n`
        )
        .setColor(`#db583e`)
        .setTimestamp();

      modlog.send(log);
    }

    user.kick(reason);

    guild.ModModule.addHistory(
      user.id,
      "infinite",
      id,
      "kick",
      reason,
      user.user.displayAvatarURL({
        format: "png",
        dynamic: true,
        size: 512,
      }),
      user.user.username,
      user.user.discriminator,
      msg.author.id,
      msg.author.username,
      msg.author.displayAvatarURL({
        format: "png",
        dynamic: true,
        size: 512,
      }),
      msg.author.discriminator
    );
  }
};

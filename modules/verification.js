/* eslint-disable no-console */
const { client } = require("../client.js");
const Discord = require('discord.js');
const con = require('../db.js');
const { Guild } = require('../guild.js');

console.log("VERIFICAITON MODULE ON")

client.on("guildMemberAdd", async (member) => {
    let GuildOBJ = new Guild(member.guild.id)

    var verifyModule = GuildOBJ.VerifyModule;

    if (verifyModule.enabled) {
        var nonVerifiedRole = verifyModule.NonVerifiedRole;

        member.roles.add(nonVerifiedRole, "New User");
    }
});

client.on("message", async (message) => {
    if (message.guild) {
        var setup = new Discord.MessageEmbed()
            .setColor('#db583e')
            .setTitle("Oh No!")
            .setAuthor('Autumn Bot Verification', 'https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.webp?size=256')
            .setDescription(`This server isn't set up with the new verification dashboard yet! Contact ${message.guild.owner} and tell them to set up the Verification Module here: https://www.autumnbot.net/dashboard`)
            .setTimestamp();

        const GuildOBJ = new Guild(message.guild.id);

        let verifyModule = GuildOBJ.VerifyModule;

        if (verifyModule == null) {
            var sql = `INSERT INTO guildsettings (Guild, VerifyModule, VerifyApps) VALUES ('${message.guild.id}', '{"enabled":false}', '{}')`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });

            return;
        }

        if (verifyModule.enabled) {

            var msgChannel = message.channel.id;
            var author = message.author;
            var guild = message.guild;

            var VerifyChannel;

            await client.channels.fetch(verifyModule.VerifyChannel)
                .then(channel => VerifyChannel = channel)
                .catch(console.error);

            var ModVerifyChannel;

            await client.channels.fetch(verifyModule.MVChannel)
                .then(channel => ModVerifyChannel = channel)
                .catch(console.error);

            var StaffRole = verifyModule.StaffRole;
            var NonVerifiedRole = verifyModule.NonVerifiedRole;

            if (verifyModule.AVRole && msgChannel == VerifyChannel && !message.author.bot) {
                message.channel.send(setup);
            }

            if (msgChannel != verifyModule.VerifyChannel || author.bot || !message.member.roles.cache.has(NonVerifiedRole)) return;
            if (message.member.roles.cache.has(StaffRole)) return;

            const accept = client.emojis.cache.get('673092790074474527');
            const deny = client.emojis.cache.get('673092807614791690');

            var app = new Discord.MessageEmbed()
                .setColor('#b5b5b5')
                .setAuthor("Verification", "https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=128")
                .setTitle(author.tag)
                .setThumbnail(author.displayAvatarURL().replace('webp', 'png'))
                .setFooter(`Awaiting Verification By Staff`)
                .setDescription(message.content)
                .setTimestamp();

            function createEmbed(color, title, authorName, authorIcon, Desc) {
                return new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(title)
                    .setAuthor(authorName, authorIcon)
                    .setDescription(Desc)
                    .setTimestamp()
            }
            var awaitdm = createEmbed('#db583e', 'Verification Application', guild.name, guild.iconURL(), `Your verification application has been submitted for reviewal in \`${guild.name}\``);

            VerifyChannel.updateOverwrite(author, { VIEW_CHANNEL: false }, "User Awaiting Verification");

            message.delete();

            var msg;

            await ModVerifyChannel.send(app)
                .then(message => msg = message)

            await msg.channel.send(`<@&${StaffRole}>`)
                .catch(console.error)
                .then(message => message.delete());

            var success = false;

            GuildOBJ.createApplication(msg.id, message.author.id, message.content)

            msg.react(accept).then(() =>
                msg.react(deny)
            );

            author.send(awaitdm);
        }
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    // When we receive a reaction we check if the reaction is partial or not
    if (reaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await reaction.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }

    var guild = reaction.message.guild;

    var GuildOBJ = new Guild(guild.id);

    var verifyModule = GuildOBJ.VerifyModule;

    if (verifyModule.enabled == false) return;

    if (user.bot) return;

    var VerifyChannel;

    await client.channels.fetch(verifyModule.VerifyChannel)
        .then(channel => VerifyChannel = channel)
        .catch(console.error);

    var ModVerifyChannel;

    await client.channels.fetch(verifyModule.MVChannel)
        .then(channel => ModVerifyChannel = channel)
        .catch(console.error);

    var apps = GuildOBJ.apps;

    var VerifyChannel;

    await client.channels.fetch(verifyModule.VerifyChannel)
        .then(channel => VerifyChannel = channel)
        .catch(console.error);

    var ModVerifyChannel;

    await client.channels.fetch(verifyModule.MVChannel)
        .then(channel => ModVerifyChannel = channel)
        .catch(console.error);

    var StaffRole = verifyModule.StaffRole;
    var NonVerifiedRole = verifyModule.NonVerifiedRole;

    var VerifiedRole = verifyModule.VerifyRole;

    var VerifyMessage = verifyModule.VMessage;

    var checkApp = await GuildOBJ.checkApp(reaction.message.id);

    if (!checkApp) return;

    var app = apps.get(reaction.message.id);

    function createEmbed(color, title, authorName, authorIcon, Desc) {
        return new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(title)
            .setAuthor(authorName, authorIcon)
            .setDescription(Desc)
            .setTimestamp()
    }

    var acceptdm = createEmbed('#52eb6c', 'Verification Application', guild.name, guild.iconURL(), VerifyMessage);
    var denydm = createEmbed('#d94a4a', 'Verification Application', guild.name, guild.iconURL(), `You have been denied for verification! Submit another application at <#${verifyModule.VerifyChannel}>`);

    function createApp(color, authorName, authorIcon, Desc, Footer, staffIcon) {
        return new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(authorName)
            .setAuthor("Verification", "https://cdn.discordapp.com/avatars/672548437346222110/3dcd9d64a081c6781289b3e3ffda5aa2.png?size=128")
            .setThumbnail(authorIcon)
            .setDescription(Desc)
            .setFooter(Footer, staffIcon)
            .setTimestamp()
    }

    var author = guild.members.cache.get(app.userID).user;

    var member = guild.members.cache.get(app.userID);

    var msg = reaction.message;

    var accepted = createApp('#52eb6c', author.tag, author.displayAvatarURL().replace('webp', 'png'), `${app.userApp}`, `Accepted By ${user.username}#${user.discriminator}`, user.displayAvatarURL().replace('webp', 'png'));
    var denied = createApp('#d94a4a', author.tag, author.displayAvatarURL().replace('webp', 'png'), `${app.userApp}`, `Denied By ${user.username}#${user.discriminator}`, user.displayAvatarURL().replace('webp', 'png'));

    if (reaction.emoji.id == "673092790074474527") {
                   
        GuildOBJ.deleteApplication(reaction.message.id)

        VerifyChannel.updateOverwrite(author, { VIEW_CHANNEL: null })
            .catch(console.error);
        member.roles.remove(NonVerifiedRole, `Verification Application Approved By ${user.username}#${user.discriminator}`)

        if (verifyModule.VerifiedRoleEnabled) {
            member.roles.add(verifyModule.VerifiedRole, `Verification Application Approved By ${user.username}#${user.discriminator}`);
        }

        msg.edit(accepted)
            .catch(console.error);
        msg.reactions.removeAll();


        client.users.cache.get(app.userID).send(acceptdm);//
    } else {
        GuildOBJ.deleteApplication(reaction.message.id)
        VerifyChannel.updateOverwrite(author, { VIEW_CHANNEL: null }, `Verification Application Denied By ${user.username}#${user.discriminator}`)
            .catch(console.error);

        msg.edit(denied)
            .catch(console.error);
        msg.reactions.removeAll();

        author.send(denydm);
    }
});

client.on("channelCreate", async (channel) => {
    if (channel.guild) {
        let GuildOBJ = new Guild(channel.guild.id)

        let verifyModule = GuildOBJ.VerifyModule;

        if (verifyModule.enabled == true) {
            channel.overwritePermissions([
                {
                    id: verifyModule.NonVerifiedRole,
                    deny: ['VIEW_CHANNEL'],
                },
            ]);

            console.log(`VerifyModule Log -- Updated Channel\n--------\n    Channel: m#${channel.name}\n    ID: ${channel.id}\n    Server ${GuildOBJ.info.name}\n--------`);
        }
    }
});

exports.verification;
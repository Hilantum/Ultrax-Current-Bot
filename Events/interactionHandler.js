const { EmbedBuilder, ChannelType, PermissionFlagsBits, PermissionsBitField } = require("discord.js");
const { ViewChannel, SendMessages, ReadMessageHistory } = PermissionFlagsBits;
const { insufficientPermissions } = require('../Utility/embedFormats.js');

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {
        const { customId, values, fields, member, user, guild, commandName, channel, guildId, message } = interaction;

        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(commandName);

            if (command.PermissionGroup = 'Headquarters') {
                if (!member.roles.cache.has("1060352770546348084") && !member.roles.cache.has("1060352768491143179")) {
                    return interaction.reply({ embeds: [insufficientPermissions] })
                }
            }

            if (command.PermissionGroup = 'ArmyCommand') {
                if (!member.roles.cache.has("1060352768491143179") && member.user.id != "820458779044347954") {
                    return interaction.reply({ embeds: [insufficientPermissions] })
                }
            }

            if (command.PermissionGroup = 'Exclusive') {
                if (member.user.id != "820458779044347954") {
                    return interaction.reply({ embeds: [insufficientPermissions] })
                }
            }

            if (!command) {
                return interaction.reply({ content: "outdated command", ephemeral: true });
            }

            command.execute(interaction, client);
        }
    }
}

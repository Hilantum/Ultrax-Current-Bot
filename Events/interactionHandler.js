const { EmbedBuilder, ChannelType, PermissionFlagsBits, PermissionsBitField } = require("discord.js");
const { ViewChannel, SendMessages, ReadMessageHistory } = PermissionFlagsBits;
const { insufficientPermissions } = require('../Utility/embedFormats.js');

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {
        const { customId, values, fields, member, user, guild, commandName, channel, guildId, message } = interaction;

        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(commandName);

            if (command.PermissionGroup === 'Moderation') {
                if (!member.roles.cache.has("1100622738755964959") && !member.roles.cache.has("968897239642677318")) {
                    return interaction.reply({ embeds: [insufficientPermissions] })
                }
            }

            if (command.PermissionGroup === 'Administration') {
                if (!member.roles.cache.has("1077756760779128893")) {
                    return interaction.reply({ embeds: [insufficientPermissions] })
                }
            }

            if (command.PermissionGroup === 'Exclusive') {
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

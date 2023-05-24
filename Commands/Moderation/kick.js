const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { insufficientPermissions, kickLog, kickMessage, kickSuccess } = require('../../Utility/embedFormats.js');

module.exports = {
    PermissionGroup: 'Administration',
    Data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the Discord Server')
        .addUserOption(option => option
            .setName('member')
            .setDescription('Member you wish to kick from the server')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for kicking the member from the server')
            .setRequired(true)
        ),

    async execute(interaction) {
        const { options } = interaction;

        const perpetrator = await interaction.guild.members.fetch(interaction.user.id)
        const member = await interaction.guild.members.fetch(options.getUser('member').id)
        const reason = options.getString('reason');

        const modLogs = await interaction.guild.channels.cache.get('1100624407350755368');

        if (perpetrator.roles.highest.position <= member.roles.highest.position) {
            return interaction.reply({ embeds: [insufficientPermissions] })
        }

        member.send({ embeds: [kickMessage] })
        await member.kick({ reason: `Perpetrator: ${perpetrator.user.tag}` }).then(() => {
            kickSuccess.setFields(
                { name: 'Offender', value: `${member}`, inline: true },
                { name: 'Offender ID', value: `${member.user.id}`, inline: true },
                { name: 'Reason', value: `${reason}`, inline: true },
                { name: ' ', value: '‎' }
            )

            kickLog.setFields(
                { name: 'Offender', value: `${member}`, inline: true },
                { name: 'Offender ID', value: `${member.user.id}`, inline: true },
                { name: 'Reason', value: `${reason}`, inline: true },
                { name: 'Moderator', value: `${perpetrator}` },
                { name: ' ', value: '‎' }
            )
            modLogs.send({ embeds: [kickLog] })
            return interaction.reply({ embeds: [kickSuccess] })
        }).catch(() => {
            interaction.reply({ content: 'err', ephemeral: true })
        })

    }
}
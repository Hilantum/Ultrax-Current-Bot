const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { BA_RED } = require('../../Utility/config.json');
const { insufficientPermissions, kickLog, kickMessage, kickSuccess } = require('../../Utility/embedFormats.js');

module.exports = {
    PermissionGroup: 'Headquarters',
    data: new SlashCommandBuilder()
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

        console.log('ok')

        const { options } = interaction;

        const perpetrator = interaction.guild.members.fetch(options.user.id)
        const member = interaction.guild.members.fetch(options.getUser('member').id)
        const reason = options.getString('reason');

        const modLogs = interaction.guild.channels.cache.get('1060352830420029591');

        if (perpetrator.roles.highest.position >= member.roles.highest.position) {
            return interaction.reply({ embeds: [insufficientPermissions] })
        }

        member.send({ embeds: [kickMessage] })
        await member.kick({ reason: `Perpetrator: ${perpetrator.user.tag}` }).then(() => {
            kickSuccess.addFields(
                { name: 'Offender', value: `${member}`, inline: true },
                { name: 'Offender ID', value: `${member.user.id}`, inline: true },
                { name: 'Reason', value: `${reason}`, inline: true },
                { name: ' ', value: '‎' }
            )

            kickLog.addFields(
                { name: 'Offender', value: `${member}`, inline: true },
                { name: 'Offender ID', value: `${member.user.id}`, inline: true },
                { name: 'Reason', value: `${reason}`, inline: true },
                { name: 'Moderator', value: `${perpetrator}` }
            )
            modLogs.send({ embeds: [kickLog] })
            return interaction.reply({ embeds: [kickSuccess] })
        })
        interaction.reply({ content: 'err' })
    }
}
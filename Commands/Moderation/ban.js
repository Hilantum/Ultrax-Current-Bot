const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { banLog, banMessage, banSuccess } = require('../../Utility/embedFormats.js');

module.exports = {
    PermissionGroup: 'Moderation',
    Data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the Discord Server')
        .addUserOption(option => option
            .setName('member')
            .setDescription('Member you wish to ban from the server')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for banning the member from the server')
            .setRequired(true)
        ),

    async execute(interaction) {
        const { options } = interaction;

        const perpetrator = interaction.guild.members.fetch(options.user.id)
        const member = interaction.guild.members.fetch(options.getUser('member').id)
        const reason = options.getString('reason');

        const modLogs = interaction.guild.channels.cache.get('1060352830420029591');

        if (perpetrator.roles.highest.position >= member.roles.highest.position) {
            return interaction.reply({ embeds: [insufficientPermissions] })
        }

        member.send({ embeds: [banMessage] });

        await member.kick({ reason: `Perpetrator: ${perpetrator.user.tag}` }).then(() => {
            banSuccess.addFields(
                { name: 'Offender', value: `${member}`, inline: true },
                { name: 'Offender ID', value: `${member.user.id}`, inline: true },
                { name: 'Reason', value: `${reason}`, inline: true },
                { name: ' ', value: '‎' }
            )

            banLog.addFields(
                { name: 'Offender', value: `${member}`, inline: true },
                { name: 'Offender ID', value: `${member.user.id}`, inline: true },
                { name: 'Reason', value: `${reason}`, inline: true },
                { name: 'Moderator', value: `${perpetrator}` },
                { name: ' ', value: '‎' }
            )
            modLogs.send({ embeds: [banLog] })
            return interaction.reply({ embeds: [banSuccess] })
        })

        interaction.reply({ content: 'err', ephemeral: true });
    }
}
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { insufficientPermissions, banLog, banMessage, banSuccess } = require('../../Utility/embedFormats.js');

module.exports = {
    PermissionGroup: 'Administration',
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

        const perpetrator = await interaction.guild.members.fetch(interaction.user.id)
        const member = await interaction.guild.members.fetch(options.getUser('member').id)
        const reason = options.getString('reason');

        const modLogs = await interaction.guild.channels.cache.get('1100624407350755368');

        if (perpetrator.roles.highest.position <= member.roles.highest.position) {
            return interaction.reply({ embeds: [insufficientPermissions] })
        }

        member.send({ embeds: [banMessage] });

        await member.ban({ reason: `Perpetrator: ${perpetrator.user.tag}` }).then(() => {

            banSuccess.setFields(
                { name: 'Offender', value: `${member}`, inline: true },
                { name: 'Offender ID', value: `${member.user.id}`, inline: true },
                { name: 'Reason', value: `${reason}`, inline: true },
                { name: ' ', value: '‎' }
            )

            banLog.setFields(
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
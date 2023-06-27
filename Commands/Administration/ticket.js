const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { insufficientPermissions, ticketInit } = require('../../Utility/embedFormats.js')

module.exports = {
    PermissionGroup: 'Staff',
    Data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Directory for ticket-related commands')
        .addSubcommand(subCommand => subCommand
            .setName('init')
            .setDescription('Initialize the Ticket System in the current channel')
        ),

    async execute(interaction) {
        const { options, channel } = interaction;

        if (options.getSubcommand() === 'init') {
            await interaction.deferReply({ ephemeral: true });

            const button = new ButtonBuilder()
                .setCustomId('ticket-open-button')
                .setLabel('Get Support')
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder()
                .setComponents(button);

            await channel.send({ content: '<@820458779044347954> **| UltraX Industries Support**\n\nHaving an issue or need a question answered? We\'re here to help! Click the button below and you\'ll be prompted with a support request form.', embeds: [ticketInit], components: [row] });
            await interaction.editReply({ content: 'successfully sent', ephemeral: true });
        }
    }
}
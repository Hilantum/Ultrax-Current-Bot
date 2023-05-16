const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    PermissionGroup: "Administration",
    Data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register a Staff Member in the UltraX Database')
        .addUserOption(option => option
            .setName('member')
            .setDescription('Member you wish to make a member of UltraX Staff')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('department')
            .setDescription('Department you wish to assign the Staff Member to')
            .setRequired(true)
            .addChoices(
                { name: 'Marketing Department', value: 'marketing' },
                { name: 'Support Department', value: 'support' }
            )
        ),

    async execute(interaction) {
        const { options } = interaction;

        const perpetrator = interaction.guild.members.fetch(options.user.id);
        const member = interaction.guild.members.fetch(options.getUser('member').id);
        const department = options.getString('department')

        await interaction.reply({ content: 'success', ephemeral: true });
    }
}
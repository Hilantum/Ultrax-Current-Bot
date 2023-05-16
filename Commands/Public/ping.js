const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    Data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with "Pong!"'),

    async execute(interaction) {
        interaction.reply({ content: 'Pong!', ephemeral: true })
    }
}
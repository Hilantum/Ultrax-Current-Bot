const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    Data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get the bot latency'),

    async execute(interaction) {
        interaction.reply({ content: `Pong!\n\nLatency is currently at ${Date.now() - interaction.createdTimestamp}ms`, ephemeral: true })
    }
}
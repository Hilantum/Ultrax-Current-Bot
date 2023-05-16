const { SlashCommandBuilder } = require('discord.js');
const loadCommands = require('../../Handlers/commandHandler.js');
const loadEvents = require('../../Handlers/eventHandler.js');
const { reloadCommands } = require('../../Utility/embedFormats.js');

module.exports = {
    PermissionsGroup: 'Exclusive',
    Data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reload the bot\'s commands and events'),

    async execute(interaction, client) {

        interaction.deferReply({ ephemeral: true })
        const channel = interaction.guild.channels.cache.get('1105306676493565952')
        setTimeout(() => {
            return interaction.editReply({ content: 'success', ephemeral: true })
        }, 5000);
        client.commands.clear()
        loadEvents(client)
        loadCommands(client)
    }
}

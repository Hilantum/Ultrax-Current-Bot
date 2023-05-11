const { ActivityType } = require('discord.js');
const { botInitialized } = require('../Utility/embedFormats.js')

const chalk = require('chalk')

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {

        console.log(chalk.red.bold('SUCCESS | ') + `Successfully logged into ${client.user.tag}\n`)
        client.user.setActivity('the British Army', { type: ActivityType.Watching });

        const guild = client.guilds.cache.get('808803284600881170')
        const channel = guild.channels.cache.get('1105306676493565952')
        //channel.send({ embeds: [botInitialized] })
    },
};
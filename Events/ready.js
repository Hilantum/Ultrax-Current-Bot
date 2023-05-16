const { MONGODB_TOKEN } = require('../Utility/config.json');
const { ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const chalk = require('chalk');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {

        mongoose.set('strictQuery', true);

        await mongoose.connect(MONGODB_TOKEN || '', {}).then(() => {
            if (mongoose.connect) {
                console.log(chalk.greenBright.bold('SUCCESS | ') + 'Connected to MongoDB')
            }
        })

        console.log(chalk.black.bold('SUCCESS | ') + `Successfully logged into ${client.user.tag}\n`)
        client.user.setActivity('UltraX Industries', { type: ActivityType.Watching });

        //const guild = client.guilds.cache.get('808803284600881170')
        //const channel = guild.channels.cache.get('1105306676493565952')
        //channel.send({ embeds: [botInitialized] })
    },
};
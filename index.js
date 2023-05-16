const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const chalk = require('chalk');

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)],
});

const loadEvents = require("./Handlers/eventHandler");
const loadCommands = require("./Handlers/commandHandler");

client.config = require('./Utility/config.json')
client.commands = new Collection();

module.exports = client;

client.login(client.config.DISCORD_TOKEN).then(() => {
    loadEvents(client);
    loadCommands(client);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log(chalk.redBright.bold('HANDLED ERROR | ') + 'Unhandled rejection successfully handled');
    console.log(reason)
});

process.on('unhandledExcection', (reason, promise) => {
    console.log(chalk.redBright.bold('HANDLED ERROR | ') + 'Unhandled exception successfully handled');
    console.log(reason)
});
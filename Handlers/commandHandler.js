module.exports = function loadCommands(client) {
    const fs = require("fs");
    const chalk = require('chalk')

    let commandsArray = [];

    const commandsFolder = fs.readdirSync("./Commands");
    for (const folder of commandsFolder) {
        const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const commandFile = require(`../Commands/${folder}/${file}`);

            const properties = { folder, ...commandFile };
            client.commands.set(commandFile.Data.name, properties);

            commandsArray.push(commandFile.Data.toJSON());

            continue;
        }
    }

    client.application.commands.set(commandsArray);

    return console.log(chalk.greenBright.bold('SUCCESS | ') + "Loaded Commands");
}
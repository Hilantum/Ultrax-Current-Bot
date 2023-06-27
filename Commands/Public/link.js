const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { alreadyLinked, notLinked, linked } = require('../../Utility/embedFormats.js');
const HubRegisterModel = require('../../Utility/Models/HubRegisterModel.js');
const noblox = require('noblox.js');

module.exports = {
    Data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link yourself or another person')
        .addUserOption(option => option
            .setName('member')
            .setDescription('Member you\'d like to link')
            .setRequired(false)
        ),

    async execute(interaction) {
        const { options, member } = interaction;
        const chosenOption = await options.getUser('member') || member.user
        
        console.log(chosenOption.id)
        console.log(await HubRegisterModel.findOne({ discordId: chosenOption.id }))

        if (await HubRegisterModel.findOne({ discordId: chosenOption.id })) {
            return await interaction.reply({ embeds: [alreadyLinked] });
        }

        const bloxlinkCollection = await fetch(`https://api.blox.link/v4/public/guilds/967882107412160572/discord-to-roblox/${chosenOption.id}`, { headers: { "Authorization": "58a1e5bb-6381-41ff-92eb-ed8251d16c7e" } })
            .then(res => res.json())
            .then(data => { return data });

        if (!bloxlinkCollection.resolved) {
            console.log(bloxlinkCollection)
            return await interaction.reply({ embeds: [notLinked] });
        }

        const collection = await HubRegisterModel.create({
            discordId: chosenOption.id,
            robloxUser: await noblox.getUsernameFromId(bloxlinkCollection.robloxID),
            robloxId: bloxlinkCollection.robloxID,
            userProducts: [],
        });

        await interaction.reply({ embeds: [linked] });
    }
}
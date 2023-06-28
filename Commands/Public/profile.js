const { SlashCommandBuilder } = require("discord.js");
const HubRegisterModel = require("../../Utility/Models/HubRegisterModel");
const { notLinked2, profile } = require("../../Utility/embedFormats");

module.exports = {
    Data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Look at a member\'s UltraX information')
        .addUserOption(option => option
            .setName('member')
            .setDescription('Member whose informationo you wish to obtain')
        ),

    async execute(interaction) {
        const { options, member } = interaction;
        const chosenOption = await options.getUser('member') || member.user

        if (!await HubRegisterModel.findOne({ discordId: chosenOption.id })) {
            return await interaction.reply({ embeds: [notLinked2] })
        }

        const collection = await HubRegisterModel.findOne({ discordId: chosenOption.id }).then(res => { return res })
        let stringBro = ' '

        for (const file of collection.userProducts) {
            if (stringBro === ' ') {
                stringBro += `${file.productName}`
            } else {
                stringBro += `\n${file.productName}`
            }
        }

        if (!collection.userProducts[0]) { stringBro = 'None' }

        profile.setFields(
            { name: 'Discord Username', value: chosenOption.username, inline: true },
            { name: 'Discord ID', value: chosenOption.id, inline: true },
            { name: 'Creation Date', value: `<t:${Math.trunc(chosenOption.createdAt / 1000)}:R>`, inline: true },
            { name: 'Products Owned', value: stringBro },
            { name: ' ', value: '‎' }
        )

        await interaction.reply({ embeds: [profile] })

        profile.setFields()
    }
}
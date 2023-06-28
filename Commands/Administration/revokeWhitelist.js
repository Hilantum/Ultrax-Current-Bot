const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { mongoose } = require('mongoose');
const HubRegisterModel = require('../../Utility/Models/HubRegisterModel');

module.exports = {
    PermissionGroup: 'Administration',
    Data: new SlashCommandBuilder()
        .setName('revokewhitelist')
        .setDescription('Revoke a member\'s whitelist')
        .addUserOption(option => option
            .setName('member')
            .setDescription('Member whose whitelist you are revoking')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('product')
            .setDescription('Product you wish to take')
            .setChoices(
                { name: 'F22 Raptor', value: '0' },
                { name: 'F16C Falcon', value: '1' },
                { name: 'F14 Tomcat', value: '2' },
                { name: 'F35A Lightning', value: '3' },
                { name: 'F35B Lightning', value: '4' },
                { name: 'F35C Lightning', value: '5' },
                { name: 'F15C Eagle', value: '6' },
            )
            .setRequired(true)
        ),

    async execute(interaction) {
        const { options, guild } = interaction;
        const member = await options.getUser('member');
        const product = await options.getString('product');

        if (!await HubRegisterModel.findOne({ discordId: member.id })) {
            return await interaction.reply({ content: 'User is not linked', ephemeral: true });
        }

        const collection = await HubRegisterModel.findOne({ discordId: member.id }).then(res => { return res })


        for (let i = 0; i < collection.userProducts.length; i++) {
            let file = collection.userProducts[i]
            if (file.productId === Number(product)) {
                found = true
                collection.userProducts.splice(i, 1)
                collection.save()
                console.log(collection.userProducts)
                return await interaction.reply({ content: 'successfully removed whitelist', ephemeral: true })
            }
        }

        if (!found) {
            return await interaction.reply({ content: 'Unable to remove whitelist', ephemeral: true })
        }

    }
}
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ProductModel = require('../../Utility/Models/ProductRegisterModel.js');
const mongoose = require('mongoose');
const HubRegisterModel = require('../../Utility/Models/HubRegisterModel.js');
const { notLinked2, whitelistSuccess } = require('../../Utility/embedFormats.js');

module.exports = {
    PermissionGroup: 'Administration',
    Data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Whitelist a linked member for a specific product')
        .addUserOption(option => option
            .setName('member')
            .setDescription('Member you\'d like to whitelist')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('product')
            .setDescription('Product you wish to give the user')
            .setRequired(true)
            .setChoices(
                { name: 'F22 Raptor', value: '0' },
                { name: 'F16C Falcon', value: '1' },
                { name: 'F14 Tomcat', value: '2' },
                { name: 'F35A Lightning', value: '3' },
                { name: 'F35B Lightning', value: '4' },
                { name: 'F35C Lightning', value: '5' },
                { name: 'F15C Eagle', value: '6' },
            )
        ),

    async execute(interaction) {
        const { options, user } = interaction;
        await interaction.deferReply({ ephemeral: true });

        const member = await options.getUser('member');
        const product = await options.getString('product');

        if (!await HubRegisterModel.findOne({ discordId: member.id })) {
            return await interaction.editReply({ content: 'User is not linked', ephemeral: true });
        }

        const productCollection = await ProductModel.findOne({ productId: product }).then(res => { return res })
        const collection = await HubRegisterModel.findOne({ discordId: member.id }).then(res => { return res })

        if (collection.userStatus === "Flagged" || collection.userStatus === "Terminated") {
            return await interaction.editReply({ content: 'This account is currently flagged.', ephemeral: true })
        }

        if (collection.userProducts) {
            for (const item of collection.userProducts) {
                if (item.productId === productCollection.productId) {
                    return await interaction.editReply({ content: 'User already has product', ephemeral: true })
                }
            }
        }

        collection.userProducts.push(productCollection)
        collection.save()

        whitelistSuccess.setFields(
            { name: 'Product Name', value: `${productCollection.productName}`, inline: true },
            { name: 'Product File', value: `${productCollection.productfile}`, inline: true },
            { name: ' ', value: '‎' }
        )

        await member.send({ content: `${member}`, embeds: [whitelistSuccess] });
        await interaction.editReply({ content: 'Success', ephemeral: true });
    }
}
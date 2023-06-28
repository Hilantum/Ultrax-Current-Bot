const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { } = require('../../Utility/embedFormats.js');
const ProductRegisterModel = require('../../Utility/Models/ProductRegisterModel');

module.exports = {
    PermissionGroup: 'Administration',
    Data: new SlashCommandBuilder()
        .setName('createproduct')
        .setDescription('Create a product that can be given to customers')
        .addStringOption(option => option
            .setName('name')
            .setDescription('Desired name for the product')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('description')
            .setDescription('Description of the product you are creating')
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName('robux')
            .setDescription('Cost of the product in robux')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('file')
            .setDescription('link to the OBFUSCATED product file')
            .setRequired(true)
        ),

    async execute(interaction) {
        const { options, user } = interaction;
        const desiredName = await options.getString('name')
        const desiredDescription = await options.getString('description')
        const desiredRobux = await options.getNumber('robux')
        const desiredFile = await options.getString('file')

        let count = 0

        if (await ProductRegisterModel.findOne({ productName: desiredName })) {
            return await interaction.reply({ content: 'Product already exists', ephemeral: true });
        }

        for (const document of await ProductRegisterModel.find()) { count += 1 }

        const collection = await ProductRegisterModel.create({
            productId: count,
            productName: desiredName,
            productDescription: desiredDescription,
            productRobux: desiredRobux,
            productfile: desiredFile
        }).then(() => { return interaction.reply({ content: 'Success', ephemeral: true }) })
    }
}
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const RegisterSchema = require('../../Models/RegisterModel.js');

module.exports = {
    PermissionGroup: 'Administration',
    Data: new SlashCommandBuilder()
        .setName('manage')
        .setDescription('Management Command Directory')
        .addSubcommand(subCommand => subCommand
            .setName('add-robux')
            .setDescription('Add robux to a member of the Staff Team for their work')
            .addUserOption(option => option
                .setName('member')
                .setDescription('Staff Member you wish to add robux to')
                .setRequired(true)
            )
            .addNumberOption(option => option
                .setName('amount')
                .setDescription('Amount of robux you\'d like to give the Staff Member')
                .setMinValue(20)
                .setMaxValue(2000)
                .setRequired(true)
            )
        )
        .addSubcommand(subCommand => subCommand
            .setName('set-status')
            .setDescription('Set the status of a Staff Member')
            .addUserOption(option => option
                .setName('member')
                .setDescription('Staff Member you wish to set the status of')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('status')
                .setDescription('Status you\'d like to give the Staff Member')
                .setRequired(true)
                .addChoices(
                    { name: 'Probation', value: 'Probation' },
                    { name: 'Fire Notice', value: 'Fire Notice' },
                    { name: 'Normal', value: 'Normal' }
                )
            )
        )
    ,

    async execute(interaction) {
        const { options } = interaction;

        if (options.getSubcommand() === 'add-robux') {
            const member = await interaction.guild.members.fetch(options.getUser('member').id)
            const amount = await options.getNumber('amount')

            const collection = await RegisterSchema.findOne({ userId: member.user.id });

            if (collection) {
                collection.userRobux += amount
                collection.save()

                return interaction.reply({ content: `Successfully added robux to user, new total is ${collection.userRobux}`, ephemeral: true })
            } else {
                return interaction.reply({ content: 'Failed to find staff member', ephemeral: true })
            }
        }

        if (options.getSubcommand() === 'set-status') {
            const member = await interaction.guild.members.fetch(options.getUser('member').id)
            const status = await options.getString('status')

            const collection = await RegisterSchema.findOne({ userId: member.user.id });

            if (collection) {
                collection.userStatus = status
                collection.save()

                return interaction.reply({ content: `Successfully set user status, new status is ${collection.userStatus}`, ephemeral: true })
            } else {
                return interaction.reply({ content: 'Failed to find staff member', ephemeral: true })
            }
        }

    }
}
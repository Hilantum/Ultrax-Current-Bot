const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const RegisterModel = require('../../Utility/Models/RegisterModel.js');
const { staffProfileSuccess } = require('../../Utility/embedFormats.js');
const register = require('../Administration/register.js');

module.exports = {
    PermissionGroup: 'Staff',
    Data: new SlashCommandBuilder()
        .setName('staff')
        .setDescription('Staff Command Directory')
        .addSubcommand(subCommand => subCommand
            .setName('profile')
            .setDescription('See the profile of yourself or another member of the staff team')
            .addUserOption(option => option
                .setName('member')
                .setDescription('Staff member you\'d like to lookup')
                .setRequired(true)
            )
        ),

    async execute(interaction) {
        const { options } = interaction;

        if (options.getSubcommand() === 'profile') {
            const member = await interaction.guild.members.fetch(options.getUser('member').id)
            const collection = await RegisterModel.findOne({ userId: member.user.id })

            if (collection) {
                const collection = await RegisterModel.findOne({ userId: member.user.id })
                const iso = new Date(collection.userJoinedStaff).getTime()

                let upperString = collection.userDepartment.charAt(0).toUpperCase() + collection.userDepartment.slice(1)
                const newStaffProfileSuccess = staffProfileSuccess

                newStaffProfileSuccess.setFields(
                    { name: 'Staff Member', value: `${member.user}`, inline: true },
                    { name: 'Staff Member ID', value: member.user.id, inline: true },
                    { name: 'Staff Hire Date', value: `<t:${Math.trunc(iso / 1000)}:R>`, inline: true },
                    { name: ' ', value: '‎' },
                    { name: 'Current Department', value: `${upperString} Department`, inline: true },
                    { name: 'Current Balance', value: `${collection.userRobux} Robux`, inline: true },
                    { name: 'Current Status', value: `${collection.userStatus}`, inline: true },
                    { name: ' ', value: '‎' },
                )

                return interaction.reply({ embeds: [newStaffProfileSuccess] })
            } else {
                return interaction.reply({ content: 'Failed to find staff member', ephemeral: true })
            }
        }
    }
}
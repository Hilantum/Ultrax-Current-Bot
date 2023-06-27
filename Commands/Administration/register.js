const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const { registerFailed, registerSuccess } = require('../../Utility/embedFormats');
const registerModel = require('../../Utility/Models/RegisterModel.js')

module.exports = {
    PermissionGroup: 'Administration',
    Data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register a Staff Member in the UltraX Database')
        .addUserOption(option => option
            .setName('member')
            .setDescription('Member you wish to make a member of UltraX Staff')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('department')
            .setDescription('Department you wish to assign the Staff Member to')
            .setRequired(true)
            .addChoices(
                { name: 'Marketing Department', value: 'marketing' },
                { name: 'Support Department', value: 'support' },
                { name: 'Management Department', value: 'management' }
            )
        ),

    async execute(interaction) {
        const { options } = interaction;

        const perpetrator = await interaction.guild.members.fetch(interaction.user.id)
        const member = await interaction.guild.members.fetch(options.getUser('member').id)
        const department = options.getString('department')

        const marketingRoleTable = [
            interaction.guild.roles.cache.get('1042909400714711121'),
            interaction.guild.roles.cache.get('1077753584470458418')
        ]

        const supportRoleTable = [
            interaction.guild.roles.cache.get('967899727146393610'),
            interaction.guild.roles.cache.get('1077753584470458418')
        ]

        if (department == 'marketing') {
            if (await registerModel.findOne({ userId: member.user.id })) {
                return interaction.reply({ embeds: [registerFailed] })
            }

            await registerModel.create({
                userId: member.user.id,
                userDepartment: department,
                userJoinedStaff: Date.now(),
                userStatus: "Probation",
            })

            await member.roles.add(marketingRoleTable)
            await member.setNickname(`MT | ${member.user.username}`)
            const newRegisterrSuccess = registerSuccess

            newRegisterrSuccess.setFields(
                { name: 'Staff Member', value: `${member.user}`, inline: true },
                { name: 'Staff Member ID', value: member.user.id, inline: true },
                { name: 'Department', value: `Marketing Department`, inline: true },
                { name: ' ', value: '‎' }
            )

            return interaction.reply({ embeds: [registerSuccess] })
        } else if (department == 'support') {
            if (await registerModel.findOne({ userId: member.user.id })) {
                return interaction.reply({ embeds: [registerFailed] })
            }

            await registerModel.create({
                userId: member.user.id,
                userDepartment: department,
                userJoinedStaff: Date.now(),
                userStatus: 'Probation',
            })

            await member.roles.add(supportRoleTable)
            await member.setNickname(`ST | ${member.user.username}`)
            const newRegisterrSuccess = registerSuccess

            newRegisterrSuccess.setFields(
                { name: 'Staff Member', value: `${member.user}`, inline: true },
                { name: 'Staff Member ID', value: member.user.id, inline: true },
                { name: 'Department', value: 'Support Department', inline: true },
                { name: ' ', value: '‎' }
            )

            return interaction.reply({ embeds: [newRegisterrSuccess] })
        } else if (department == 'management') {
            if (await registerModel.findOne({ userId: member.user.id })) {
                return interaction.reply({ embeds: [registerFailed] })
            }

            await registerModel.create({
                userId: member.user.id,
                userDepartment: department,
                userJoinedStaff: Date.now(),
                userStatus: 'Normal',
            })

            await member.roles.add(supportRoleTable)
            await member.setNickname(`MA | ${member.user.username}`)
            registerSuccess.setFields(
                { name: 'Staff Member', value: `${member.user}`, inline: true },
                { name: 'Staff Member ID', value: member.user.id, inline: true },
                { name: 'Department', value: 'Management Department', inline: true },
                { name: ' ', value: '‎' }
            )

            return await interaction.reply({ embeds: [registerSuccess] })
        }

        await member.roles.add(marketingRoleTable);
        await member.setNickname(`MT | ${member.user.username}`);

        await interaction.reply({ content: 'err', ephemeral: true });
    }
} 

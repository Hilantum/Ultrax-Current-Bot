const { EmbedBuilder, ChannelType, PermissionFlagsBits, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { ViewChannel, SendMessages, ReadMessageHistory } = PermissionFlagsBits;
const { insufficientPermissions, ticketOpen } = require('../Utility/embedFormats.js');

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {
        const { customId, values, fields, member, user, guild, commandName, channel, guildId, message } = interaction;

        if (customId === "ticket-open-button") {
            if (member.roles.cache.has('1110806852431790160')) {
                return await interaction.reply({ content: ':warning: **| Existing Ticket**\n\nYou already have a ticket open! Please delete this ticket before attemptting to open another. If this is an issue, contact a manager.', ephemeral: true })
            }

            const modal = new ModalBuilder()
                .setCustomId('ticket-open-modal')
                .setTitle('Support Request');

            const typeCategory = new TextInputBuilder()
                .setCustomId('ticket-open-modal-category')
                .setLabel("Request Category?")
                .setPlaceholder('"Support", "Marketing", etc.')
                .setMinLength(5)
                .setMaxLength(15)
                .setRequired(true)
                .setStyle(TextInputStyle.Short);

            const typeDescription = new TextInputBuilder()
                .setCustomId('ticket-open-modal-description')
                .setLabel("Request Description")
                .setPlaceholder('A detailed description of your issuue, as well as supporting evidence (if applicable)')
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph);

            const actionRowOne = new ActionRowBuilder().addComponents(typeCategory)
            const actionRowTwo = new ActionRowBuilder().addComponents(typeDescription)
            modal.addComponents(actionRowOne, actionRowTwo)

            return await interaction.showModal(modal)
        }

        if (customId === "ticket-open-modal") {
            const inputCategory = fields.getTextInputValue('ticket-open-modal-category')
            const inputDescription = fields.getTextInputValue('ticket-open-modal-description')

            await interaction.deferReply({ ephemeral: true })

            const theirTicket = await guild.channels.create({
                name: `ticket-${member.user.username}`,
                type: ChannelType.GuildText,
                parent: '968211070634303508',
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: guild.roles.cache.get('1077753584470458418'),
                        allow: [PermissionFlagsBits.ViewChannel]
                    }
                ]
            })

            const ticketDelete = new ButtonBuilder()
                .setCustomId('delete')
                .setLabel('Delete Request')
                .setStyle(ButtonStyle.Danger);

            const ticketClaim = new ButtonBuilder()
                .setCustomId('claim')
                .setLabel('Claim Request')
                .setStyle(ButtonStyle.Secondary);

            const embedRow = new ActionRowBuilder().addComponents(ticketDelete, ticketClaim)

            await member.roles.add('1110806852431790160')
            await theirTicket.send({
                content: `| ${member}\n\n**Request Category:** ${inputCategory}\n\n**Request Description:** ${inputDescription}\n\n`,
                embeds: [ticketOpen],
                components: [embedRow],
                ephemeral: true
            })

            return await interaction.editReply({
                content: `<:ultrax_rounded:1110809278895370300>** | Ticket Opened**\n\nSuccessfully opened a ticket for your request! Please navigate to the channel and comply with the requests from Staff Members. ${theirTicket}`,
                ephemeral: true
            })
        }

        if (customId == 'delete') {
            if (member.roles.cache.has('968897239642677318') || member.roles.cache.has('1077756760779128893')) {
                await channel.delete()
                return await interaction.reply({ content: 'done', ephemeral: true });
            }
        }

        if (customId == 'claim') {
            if (member.roles.cache.has('968897239642677318') || member.roles.cache.has('1077756760779128893')) {
                const string = channel.name
                const splitString = string.split('-')
                if (splitString[0] === 'claimed') { return await interaction.reply({ content: 'Ticket Already Claimed', ephemeral: true }) }

                const embed = new EmbedBuilder()
                    .setColor('#000001')
                    .setDescription(`This ticket has been claimed by ${member}, and further support will derive from them.\n‎`)
                    .setFooter({ text: 'UltraX Industries', iconURL: 'https://media.discordapp.net/attachments/1067275171532132422/1100621447434608730/image_3.png?width=375&height=375' })
                    .setTimestamp();

                channel.setName(`claimed-${splitString[1]}`)
                return await interaction.reply({ embeds: [embed] })
            }
        }

        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(commandName);

            if (command.PermissionGroup === 'Staff') {
                if (!member.roles.cache.has("1077753584470458418") && !member.roles.cache.has('1077756760779128893')) {
                    return interaction.reply({ embeds: [insufficientPermissions] })
                }
            }

            if (command.PermissionGroup === 'Administration') {
                if (member.roles.cache.has('1077756760779128893') == false) {
                    return interaction.reply({ embeds: [insufficientPermissions] })
                }
            }

            if (command.PermissionGroup === 'Exclusive') {
                if (member.user.id != "820458779044347954") {
                    return interaction.reply({ embeds: [insufficientPermissions] })
                }
            }

            if (!command) {
                return interaction.reply({ content: "outdated command", ephemeral: true });
            }

            command.execute(interaction, client);
        }
    }
}

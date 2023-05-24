const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const noblox = require('noblox.js');

module.exports = {
    PermissionGroup: 'Exclusive',
    Data: new SlashCommandBuilder()
        .setName('promote')
        .setDescription('yes')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName("who")
                .setDescription("whoo")
                .setRequired(true)
        ),

    async execute(interaction) {

        const currentUser = await noblox.setCookie('_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_931F43612032EB61A3BFF9A676985AD4717EDDDE627A210318D2328EDB4ED3163D93DFE959EEAE13CAE7DBF38DB3453672BA645183D8F57D9812A306CA595B8AAFB9F7DF75DB501D6639BDCC5B3F8A41942E8255AC66A0973CA200CB182BBA96FE6F5A2A096EB780FF527D01B490FEFE9080009108B6CA8C647D9197CCE3CD868C0F3A881A85F693BF04A256E0216EB8E1ECA40C506A1888FE6F368BC75140141B68A64AF21457F1345940AA5649DA9F539D374CD5B214720EB8D4D2F88873CA972682468CE771F141C481CA9D6583F9852B3312317FE648201A09ECDC829F598E1ADD8D14160FB0A3101D8B8ED52907A708920E4595E633D2652CAB49F228C30D1E45013767E76970105BA062B786BCA745F9461D162E071B5C30D656D901501B2432D340A145C97837B85C141E3A9638E8C181C1A9A545261851547F4116549612F654AC17E2B1FE5ED84F3A0EDEA995EF0E83AA0954A4CA3E878758522F1445C4929738DB904A8838AC7F35C85344679EF815')

        const { options } = interaction;

        const userString = options.getString("who");
        const seperatedArray = userString.split(' ');
        console.log(seperatedArray)

        await interaction.deferReply({ ephemeral: true })

        for (const user in seperatedArray) {
            if (user === ' ') {
                return console.log('Caught a blank string')
            }
            const userId = await noblox.getIdFromUsername(seperatedArray[user]).catch(error => {
                return userId
            })
            if (userId) {
                const rank = await noblox.getRankInGroup(3054949, userId)
                if (rank < 15) {
                    await noblox.promote(3054949, userId).then(() => {
                        console.log(`I have promoted ${seperatedArray[user]}`)
                    }).catch(() => {
                        console.log(`Failed to promote ${seperatedArray[user]}`)
                    })
                } else {
                    console.log(`${seperatedArray[user]} is a Sergeant Major!`)
                }
            }
            const timer = ms => new Promise(res => setTimeout(res, ms))
            await timer(5000)
        }
        await interaction.editReply({ content: 'done', ephemeral: true })
    }
}
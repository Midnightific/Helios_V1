// By Midnightific

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a specified user from the server.')
    .addUserOption(option => option
        .setName('User')
        .setDescription('The user to ban.')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('Reason')
        .setDescription('The reason why you want to ban the user.')
        .setRequired(true)
    ),

    exec: async(client, interaction) => {
        const perms = [
            client.config.roles.TA,
            client.config.roles.O5,
            client.config.roles.SiD,
            client.config.roles.L4,
            client.config.roles.L3,
            client.config.roles.HMod,
            client.config.roles.SMod,
            client.config.roles.CMod,
            client.config.roles.PMod
        ]

        if (!interaction.member.roles.cache.some(role => perms.includes(role.name))) return await interaction.reply({ content: "Insufficient Permissions!", ephemeral: true })

        const user = interaction.options.getUser('User')
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {})

        if(!member) return interaction.followUp("Unable to retrieve data for that user.");
        const reason = interaction.options.getString('Reason')
        
        if(interaction.member.roles.highest.position <= member.roles.highest.position) 
        return interaction.followUp('Given member have higher or equal rank as you so I can not ban them.')
        
        const message = new MessageEmbed()
        .setDescription('`**${member.user.tag}** has been banned from the server for \`${reason}\``')
        .setColor(0x53DD6C)
        .setFooter(`'This user was banned from the server by ${interaction.user.username}'`)
        .setTimestamp()

        await member.user.send(`You are banned from **\`${interaction.guild.name}\`** for \`${reason}\``).catch(err => {})
        member.ban({ reason })

        return interaction.followUp({ embeds: [ embed ]})

    },
};
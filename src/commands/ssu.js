const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ssu')
		.setDescription('Announce an SSU!'),

    // Yeah, I wrote this myself so idk if this is right or not 

    exec: async(client, interactionn) => {
        const perms = [
            client.config.roles.TA,
            client.config.roles.O5,
            client.config.roles.SiD,
            client.config.roles.L4,
            client.config.roles.L3,
        ]

        if (!interaction.member.roles.cache.some(role => perms.includes(role.name))) return await interaction.reply({ content: "Insufficient Permissions!", ephemeral: true })

        const SSUChannel = "773990725733449729"
        const Interactionuser = `${interaction.user.tag}`

        interaction.reply({ content: "Success!"})
        client.channels.cache.get(SSUChannel).send({ embeds: [new MessageEmbed()
            .setAuthor(`An **SSU** has been started by ${interaction.user.tag}`)
            .addField('Join the game here:')
            .addField('||@here||')
            .setColor(0x53DD6C)
        ]})
    }};
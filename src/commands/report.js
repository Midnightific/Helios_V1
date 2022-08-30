const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    global: true,
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Report something.')
        .addStringOption(option => option
            .setName('user')
            .setDescription('The user to report.')
            .setRequired(true)
            )
        .addStringOption(option => option
            .setName('violation')
            .setDescription('The rule/activity the user broke.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('evidence')
            .setDescription('The evidence of the violation.')
            .setRequired(true)
        ),

	exec: async(client, interaction) => {

        const reportChannel = "913638638661812275"
        if (interaction.inGuild()) return await interaction.reply({ content: "This command must be ran inside of DMs", ephemeral: true })

		const user = interaction.options.getString('user')
		const violation = interaction.options.getString('violation')
		const evidence = interaction.options.getString('evidence')

        interaction.reply({ content: "Successfully submitted report!"})
        client.channels.cache.get(reportChannel).send({ embeds: [new MessageEmbed()
            .setAuthor(`Report from: ${interaction.user.tag}`)
            .addField('Reportee:', user)
            .addField('Violation:', violation)
            .addField('Evidence:', evidence)
            .setColor(0x53DD6C)
        ]})
	}
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('event')
		.setDescription('Announce an event.')
        .addStringOption(option => option
            .setName('ping')
            .setDescription('The ping type.')
            .addChoice('none', 'none')
            .addChoice('here', '@here')
            .setRequired(true)
            )
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel to send the event to.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('title')
            .setDescription('The title of the event')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('text')
            .setDescription('The contents of the event')
            .setRequired(true)
        ),

        exec: async(client, interaction) => {
            const perms = [
                client.config.roles.TA,
                client.config.roles.O5,
                client.config.roles.SiD,
                client.config.roles.L4,
                client.config.roles.L3,
            ]
    
            if (!interaction.member.roles.cache.some(role => perms.includes(role.name))) return await interaction.reply({ content: "Insufficient Permissions!", ephemeral: true })

		const ping = interaction.options.getString('ping')
		const channel = interaction.options.getChannel('channel')
		const title = interaction.options.getString('title')
		const text = interaction.options.getString('text')

        if (!channel.isText()) return await interaction.reply({ content: 'You must specify a text channel.', ephemeral: true })

        const confirm = new MessageEmbed()
        .setAuthor(title)
        .setDescription('Press [YES] to confirm you want to post this event.')
        .addField('Ping:', ping, true)
        .addField('Channel:', `<#${channel.id}>`, true)
        .addField('Title:', title, true)
        .addField('Body:', text, true)

        const button1 = new MessageButton().setCustomId('confirm').setLabel('Confirm').setStyle('SUCCESS');
        const button2 = new MessageButton().setCustomId('cancel').setLabel('Cancel').setStyle('DANGER')
        const components = new MessageActionRow().addComponents(button1, button2)
        
        await interaction.reply({embeds: [confirm], components: [components] })

        const filter = i => i.user.id == interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            button1.setDisabled(true)
            button2.setDisabled(true)
            await i.update({ components: [new MessageActionRow().addComponents(button1, button2) ] })
            if (i.customId === 'confirm') {
                await interaction.followUp({ content: `Event successfully sent to <#${channel.id}>.`, ephemeral: true })

                channel.send({ embeds: [new MessageEmbed().setAuthor(title).setDescription(text).setColor(0x53DD6C).setFooter(`Event by: ${interaction.member.displayName}`)]})
                if (ping != 'none') {
                    const message = channel.send({ content: ping }).then(msg => msg.delete({ timeout: 500 }))
                }
            } else if (i.customId === 'cancel') {
                await interaction.followUp({ content: `Event was cancelled.`, ephemeral: true })
            }
        })

        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
	}
};
const { Client, Intents } = require('discord.js');

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageComponentInteraction } = require("discord.js");

const server = require("./server.js")

const config = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.config = config

client.once('ready', () => {
  console.log('Ready!');

  /* const arrayOfStatus = [
    `Area-61`,
    `The Manufacturing Department`,
    `Midnightific`,
    `The Mobile Task Forces`,
    `The Administrative Department`,
    `The Department of External Affairs`,
    `The Ethics Committee`
  ];
  setInterval(() => {
    let index = Math.floor((Math.random() * arrayOfStatus.length));
    const status = arrayOfStatus[index];
    client.user.setActivity(status, { type: "WATCHING" })
  }, 900000) */
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = require(`./commands/${interaction.commandName}`);
  // console.log(command)
  if (command) {
    command.exec(client, interaction)
  }
});

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
let global = [];

const clientId = config.clientId;
const guildId = config.guildId;
const token = config.token;

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (!command.disabled) {
    if (command.global && command.global == true) {
      global.push(command.data.toJSON());
    } else {
      console.log(command)
      commands.push(command.data.toJSON());
    }
  }
};

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    if (global.length > 0) {
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: global },
      );
    }

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }

})();

/*
client.on("guildMemberAdd", member => {
  const guildMemberAddedSignal = new MessageEmbed()
    .setAuthor({ name: `📥 ${member.user.username} has joined!` })
    .setDescription(member.user.id)
    .addField('Something wrong?', "Click the button below to mark as suspicious!", true)
    .setColor("AQUA")
  const markSuspicious = new MessageEmbed()
    .setAuthor({ name: `⛔️ ${member.user.username} has been marked suspicious!` })
    .setDescription(member.user.id)
    .setColor("RED")

  const button1 = new MessageButton().setCustomId('mark_suspicious').setLabel('Mark as Suspicious').setStyle('DANGER');
  const components = new MessageActionRow().addComponents(button1)

  const Channel = client.channels.cache.get(config.log_channel)
  const reports = client.channels.cache.get(config.report_channel)

  Channel.send({ embeds: [guildMemberAddedSignal], components: [components] })

  const filter = i => i.user.id == member.user.id;
  const collector = Channel.createMessageComponentCollector({ filter, time: 15000 });

  collector.on('collect', async i => {
    button1.setStyle("SECONDARY")
    button1.setDisabled(true)
    await i.update({ components: [new MessageActionRow().addComponents(button1)] })
    if (i.customId === 'mark_suspicious') {

      reports.send({ embeds: [markSuspicious] })

    }
  })

  collector.on('end', collected => console.log(`Collected ${collected.size} items`));
})

client.on("guildMemberRemove", member => {
  const guildMemberLeftSignal = new MessageEmbed()
    .setAuthor({ name: `👋 ${member.user.username} has left!` })
    .setDescription(member.user.id)
    .setColor("DARKER_GREY")

  const Channel = client.channels.cache.get(config.log_channel)

  Channel.send({ embeds: [guildMemberLeftSignal] })

})
*/

client.login(token);
server();
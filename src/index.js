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

client.login(token);
server();

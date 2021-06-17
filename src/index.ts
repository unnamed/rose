// load environment variables
require('dotenv').config();

import {Client} from 'discord.js';
import logger from './log';

import loadListeners from './loader/listener.loader';
import loadCommands from './loader/command.loader';

const client = new Client();

client.on('ready', () => {
	logger.fine(`Logged in as ${client.user.tag}`);
});

loadListeners(client);
loadCommands();

client.login(process.env.BOT_TOKEN)
	.catch(console.error);
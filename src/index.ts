// load environment variables
require('dotenv').config();

import {Client} from 'discord.js';
import logger from './log';

import loadListeners from './listener/listener.loader';
import loadCommands from './command/command.loader';

const client = new Client();

client.on('ready', () => {
	logger.fine(`Logged in as ${client.user.tag}`);
});

loadListeners(client);
loadCommands();

client.login(process.env.BOT_TOKEN)
	.catch(console.error);
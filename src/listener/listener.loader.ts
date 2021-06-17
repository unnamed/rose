import {Client} from 'discord.js';
import messageListener from './message.listener';
import logger from '../log';

export type Listener = { event: string, execute: (...params) => unknown };

export default (client: Client): void => {

	const register = ({event, execute}: Listener) => client.on(event, execute);

	register(messageListener);

	const count = client
		.eventNames()
		.reduce(
			(acc, event) => acc + client.listenerCount(event),
			0
		);

	logger.info(`Successfully loaded ${count} event listeners`);

};
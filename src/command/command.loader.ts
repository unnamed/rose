import {register, registry} from './command.manager';

import AnnounceCommand from './summary/announce.command';
import PingCommand from './summary/ping.command';
import ConfigCommand from './summary/config.command';

import './default.argument.parsers';
import logger from '../log';

export default () => {

	register(AnnounceCommand);
	register(PingCommand);
	register(ConfigCommand);

	logger.info(`Successfully loaded ${registry.size} commands`);
};
import {Message} from 'discord.js';
import {PartialCommand} from './command';

/**
 * Determines if the given message can invoke
 * the given command by checking its permissions
 */
export function hasPermissions(message: Message, command: PartialCommand): boolean {
	return command.permissions?.use?.every(perm => message.member.hasPermission(perm))
		&& command.permissions?.execute?.every(perm => message.guild.me.hasPermission(perm));
}
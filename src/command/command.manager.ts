import {Command, CommandParameter, PartialCommand} from './command';
import {ArgumentIterator, CommandElement, ElementCreator, ParseContext} from './parse';
import {CommandElementCompound} from './compound';
import {ParentCommandElement} from './parent';
import config from '../config.js';
import {Message} from 'discord.js';

export const registry = new Map<string, Command>();
export const elementCreators = new Map<string, ElementCreator>();
const aliasesRegistry = new Map<string, Command>();

function getElements(parameters: CommandParameter[]): CommandElement[] {
	return parameters.map(param => {
		const create = elementCreators.get(param.type);
		if (!create) {
			throw new Error(`No creator registered for type ${param.type}`);
		}
		return create(param);
	});
}

export function register(command: Command): void {
	registry.set(command.name, command);
	if (command.aliases) {
		command.aliases.forEach(alias => aliasesRegistry.set(alias, command));
	}

	const root = new CommandElementCompound(
		command.name,
		getElements(command.arguments as CommandParameter[])
	);

	function setRawExecutor(partialCommand: PartialCommand, elements: CommandElement[]) {
		partialCommand.executeRaw = async (context: ParseContext): Promise<void> => {
			const args = [];
			elements.forEach(component => args.push(context.values.get(component)));
			await partialCommand.execute.apply(undefined, args);
		};
	}

	setRawExecutor(command, root.components);

	if (command.children) {
		const children = new Map<string, PartialCommand>();
		for (const subName in command.children) {
			const subCommand: PartialCommand = command.children[subName];
			subCommand.element = new CommandElementCompound(
				subName,
				getElements(subCommand.arguments as CommandParameter[])
			);
			setRawExecutor(subCommand, (subCommand.element as CommandElementCompound).components);
			children.set(subName, subCommand);
		}
		command.element = new ParentCommandElement(command.name, children, root);
	} else {
		command.element = root;
	}
}

export function findCommand(commandLabel: string): Command | undefined {
	commandLabel = commandLabel.toLowerCase();
	return registry.get(commandLabel) || aliasesRegistry.get(commandLabel);
}

export async function dispatch(message: Message, args: string[]): Promise<void> {

	const commandLabel = args.shift()?.toLowerCase() as string;
	const command: Command | undefined = findCommand(commandLabel);
	const guild = message.guild;
	const member = message.member;

	if (!guild || !member) {
		return;
	}

	if (!command) {
		return;
	}

	if (
		command.permissions.execute.every(permission => message.guild.me.hasPermission(permission))
		&& command.permissions.use.every(permission => member.hasPermission(permission))
	) {
		message.channel?.send({
			embed: {
				title: 'No Permission!',
				description: 'Sorry, the bot or you don\'t have the required permissions to execute/use the command :(',
				color: config.color,
				footer: {
					text: `Executed by ${message.author.username}`,
					iconURL: guild.iconURL({ size: 64, format: 'png' })
				}
			}
		});
		return;
	}

	const context = new ParseContext(
		new ArgumentIterator(args),
		command
	);

	context.variables.set('message', message);

	const executed = await context.parse();

	executed.executeRaw(context).catch(err => {
		if (err.title) {
			message.channel.send({
				embed: {
					color: config.color,
					footer: {
						text: `Requested by ${message.author.username}`,
						iconURL: message.author.avatarURL()
					},
					...err
				}
			});
		}
	});
}
import {elementCreators} from './command.manager';
import {CommandElement, ParseContext, ParseError} from './parse';
import {CommandParameter} from './command';
import {Guild, Message} from 'discord.js';

const tagRegex = new RegExp(/.+#[0-9]{4}$/g);
const snowflakeRegex = new RegExp(/[0-9]{18}$/g);
const mentionRegex = new RegExp(/<@!([0-9]{18})>$/g);

///
/// Member argument parser, resolves
/// ids, tags and mentions
///
elementCreators.set(
	'member',
	(spec: CommandParameter) => {
		return new class extends CommandElement {

			constructor() {
				super(spec.name as string);
			}

			async parse(context: ParseContext): Promise<void> {
				const message: Message = context.variables.get('message');
				const guild: Guild = message.guild;
				if (!guild) {
					throw new ParseError('Not in a guild', 'This command must be executed in a guild!');
				}
				const member: string = context.args.next();

				let found = undefined;
				// check if it's an ID
				if (member.match(snowflakeRegex)) {
					found = await guild.members.fetch(member);
				}
				// check if it's a mention
				if (!found) {
					const matches = member.matchAll(mentionRegex);
					if (matches) {
						const match = matches.next()?.value;
						if (match) {
							const id = match[1];
							found = await guild.members.fetch(id);
						}
					}
				}
				// check if it's a tag
				if (!found && member.match(tagRegex)) {
					found = guild.members.cache.find(m => m.user.tag === member);
				}

				if (found) {
					return found;
				} else {
					throw new ParseError(
						'Member not found',
						`A member with ID or tag \`${member}\` cannot be found.
            **Note:** Tags only work when the member is cached.`
					);
				}
			}
		};
	}
);

///
/// Message argument "parser", doesn't
/// consume arguments, so it's really
/// an argument "injector"
/// 
elementCreators.set(
	'message',
	(spec: CommandParameter) => new class extends CommandElement {
		constructor() {
			super(spec.name as string);
		}

		async parse(context: ParseContext): Promise<void> {
			context.values.set(this, context.variables.get('message'));
		}
	}
);

elementCreators.set(
	'voice-channel',
	(spec: CommandParameter) => new class extends CommandElement {
		constructor() {
			super(spec.name);
		}

		async parse(context: ParseContext) {
			const arg = context.args.next();
			// TODO: Enhance this
			const message: Message = context.variables.get('message');
			const channel = await message.guild.channels.resolve(arg);
			if (!channel || channel.type !== 'voice') {
				throw new ParseError(
					'invalid-channel',
					'Invalid channel, unknown channel or not a voice channel'
				);
			}
			context.values.set(this, channel);
		}
	}
);

///
/// Integer argument parser, converts
/// strings to ints using the parseInt
/// function and throws an error when
/// it's NaN
///
elementCreators.set(
	'int',
	(spec: CommandParameter) => new class extends CommandElement {
		constructor() {
			super(spec.name as string);
		}

		async parse(context: ParseContext): Promise<void> {
			const arg = context.args.next();
			const value = parseInt(arg);
			if (isNaN(value)) {
				throw new ParseError(
					'invalid-int',
					'Invalid Argument: Not an integer'
				);
			}
			context.values.set(this, value);
		}
	}
);

///
/// Dummy argument "parser", it
/// returns a single string
///
elementCreators.set(
	'str',
	(spec: CommandParameter) => new class extends CommandElement {

		constructor() {
			super(spec.name as string);
		}

		async parse(context: ParseContext): Promise<void> {
			context.values.set(this, context.args.next());
		}

	}
);

///
/// String argument "parser", the arguments
/// are already strings, so parsing isn't necessary
/// but this argument "parser" joins all the
/// args into a single string
///
elementCreators.set(
	'...str',
	(spec: CommandParameter) => new class extends CommandElement {

		constructor() {
			super(spec.name as string);
		}

		async parse(context: ParseContext): Promise<void> {
			// Initialize with an argument because
			// at least one argument is required
			const result: string[] = [];
			do {
				result.push(context.args.next());
			} while (context.args.hasNext());
			context.values.set(this, result.join(' '));
		}

		get representation(): string {
			return `<${this.name}...>`;
		}

	}
);
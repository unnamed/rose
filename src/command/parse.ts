import {CommandParameter, PartialCommand} from './command';

/**
 * Represents a command parse error, this
 * error messages are supposed to be translated.
 * That's why it has an 'id' property.
 */
export class ParseError implements Error {

	readonly name: string = 'ParseError';

	constructor(
		public id: string,
		public message: string
	) {
	}

}

/**
 * Class for maintaining track of what arguments
 * were consumed by the command elements
 */
export class ArgumentIterator {

	// this cursor actually points to the next argument
	cursor = 0;

	constructor(
		private args: string[]
	) {
	}

	/**
	 * Determines if this argument iterator
	 * instance has more elements to return
	 * by calling the 'next' method
	 * @returns True if there are available
	 * elements
	 */
	hasNext(): boolean {
		return this.cursor < this.args.length;
	}

	/**
	 * Passes to the next element in this iterator
	 * instance. Throws a ParseError if no more args
	 * available.
	 * @returns The next argument in this iterator
	 */
	next(): string {
		this.checkAvailableArguments();
		return this.args[this.cursor++];
	}

	/**
	 * Passes to the next element and keeps joining
	 * next elements to the resulting string until the
	 * first quote found is closed. Throws a ParseError
	 * if no more args available.
	 * @returns The next quoted argument in this iterator
	 */
	nextQuoted(): string {
		this.checkAvailableArguments();

		let argument = this.args[this.cursor];
		const quote = argument.charAt(0);

		// normal argument, just return it
		if (quote != '"' && quote != '\'') {
			this.cursor++;
			return argument;
		}

		// remove the initial quote
		argument = argument.substring(1);
		const values: string[] = [];

		while (true) {
			const builder: string[] = [];
			let escaped = false;

			for (let i = 0; i < argument.length; i++) {
				const current = argument.charAt(i);
				if (current == '\\') {
					escaped = true;
					continue;
				}
				if (current == quote) {
					if (escaped) {
						builder.push(quote);
						escaped = false;
						continue;
					}

					this.cursor++;
					const extra = argument.substring(i + 1);
					if (extra.length > 0) {
						this.args.splice(this.cursor, 0, extra);
					}
					values.push(builder.join(''));
					return values.join(' ');
				}

				if (escaped) {
					builder.push('\\');
					escaped = false;
				}

				builder.push(current);
			}

			if (builder.length > 0) {
				values.push(builder.toString());
			}

			// pass to the next argument
			this.cursor++;
			if (this.cursor >= this.args.length) {
				break;
			} else {
				argument = this.args[this.cursor];
			}
		}

		return values.join(' ');
	}

	private checkAvailableArguments(): void {
		if (this.cursor >= this.args.length) {
			throw new ParseError(
				'arguments.insufficient',
				'Insufficient Arguments'
			);
		}
	}

}

/**
 * Class containing information about the
 * command line parsing process
 */
export class ParseContext {

	public readonly variables = new Map<any, any>();
	public readonly values = new Map<CommandElement, any>();

	constructor(
		public args: ArgumentIterator,
		public command: PartialCommand
	) {
	}

	async parse(): Promise<PartialCommand> {
		await this.command.element?.parse(this);
		// 'command' may change during parsing
		return this.command;
	}

}

/**
 * Represents a command element, its principal
 * responsibility is to fill the 'values' field
 * from the 'context'. In order to do that, some
 * implementations may consume the 'args' field
 * from the 'context' field
 */
export abstract class CommandElement {

	protected constructor(
		public name: string
	) {
	}

	/**
	 * Gets the string representation of this
	 * command element instance
	 */
	get representation(): string | undefined {
		return `<${this.name}>`;
	}

	abstract parse(context: ParseContext): Promise<void>;

}

/**
 * Type for CommandElement creator functions,
 * it can take extra properties from the spec
 * parameter
 */
export type ElementCreator = (spec: CommandParameter) => CommandElement;
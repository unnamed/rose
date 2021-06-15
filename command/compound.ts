import { CommandElement, ParseContext } from './parse.ts';

/**
 * Represents a compound of other
 * CommandElements, it totally delegates
 * the functionality to its components
 */
export class CommandElementCompound extends CommandElement {

  constructor(
    name: string,
    public components: CommandElement[]
  ) {
    super(name);
  }

  /**
   * @inheritdoc
   * Returns the joined representation of this
   * element and its components
   */
  get representation(): string {
    return `${this.name} ${this.components.map(component => component.name).join(' ')}`;
  }

  async parse(context: ParseContext): Promise<void> {
    for (let component of this.components) {
      await component.parse(context);
    }
  }

};
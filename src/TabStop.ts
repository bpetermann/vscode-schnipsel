/**
 * Represents a VS Code tab stop, encapsulating its name, ID, and formatting logic.
 * This class standardizes the creation and representation of a snippet placeholder.
 */
export class TabStop {
  constructor(
    public name: string,
    public index: number,
    public readonly id: number | null,
    public withPlaceholder: boolean = true
  ) {}

  get value(): string {
    return this.id !== null ? `$${this.id}` : '';
  }

  get placeholder(): string {
    if (this.id === null) {
      return '';
    }
    return this.withPlaceholder ? `\${${this.id}:${this.name}}` : this.value;
  }

}

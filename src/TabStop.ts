/**
 * Represents a VS Code tab stop, encapsulating its name, ID, and formatting logic.
 * This class standardizes the creation and representation of a snippet placeholder.
 */
export class TabStop {
  constructor(
    public name: string,
    public index: number,
    public id: number | null,
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

  /**
   * True if this tab stop has an ID and should be registered.
   */
  shouldRegister(): boolean {
    return this.id !== null;
  }

  /**
   * Marks this tab stop as non-registerable.
   */
  disable(): void {
    this.id = null;
  }
}

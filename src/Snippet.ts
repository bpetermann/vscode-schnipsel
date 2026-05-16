import { SNIPPET } from './constants';

/**
 * Represents a VS Code user snippet, formatting its content into the required JSON structure.
 */
export class Snippet {
  private readonly name: string;
  private readonly prefix: string;
  private readonly description: string;

  /**
   * Creates an instance of Snippet.
   * @param body The main content of the snippet, as an array of strings (lines).
   * @param languageId The language ID (e.g., 'typescript', 'javascript') for context.
   * @param fileName The original filename, used for naming and prefixing the snippet.
   */
  constructor(
    private readonly body: string[],
    languageId: string,
    fileName: string
  ) {
    this.name = `${SNIPPET.NAME} ${fileName}`;
    this.prefix = fileName;
    this.description = `Auto-generated ${languageId} snippet from ${fileName}`;
  }

  public toString(): string {
    const valueJson = JSON.stringify(
      { prefix: this.prefix, body: this.body, description: this.description },
      null,
      2
    ).replace(/\n/g, '\n  ');
    return `\n  ${JSON.stringify(this.name)}: ${valueJson}\n`;
  }
}

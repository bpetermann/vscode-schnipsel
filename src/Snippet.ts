import { SNIPPET } from './constants';

export class Snippet {
  private readonly name: string = '';
  private readonly prefix: string = '';
  private readonly description: string = '';

  constructor(
    private readonly body: Array<string>,
    languageId: string,
    fileName: string
  ) {
    this.body = body;
    this.name = `${SNIPPET.NAME} ${fileName}`;
    this.prefix = fileName;
    this.description = `Auto-generated ${languageId} snippet from ${fileName}`;
  }

  toString(): string {
    return JSON.stringify(
      {
        [this.name]: {
          prefix: this.prefix,
          body: this.body,
          description: this.description,
        },
      },
      null,
      2
    ).slice(1, -1);
  }
}

export class Snippet {
  private readonly name: string = '';
  private readonly prefix: string = '';
  private readonly description: string = '';

  constructor(private readonly body: Array<string> = []) {
    this.body = body;
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

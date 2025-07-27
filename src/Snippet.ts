export class Snippet {
  constructor(
    private readonly name: string,
    private readonly prefix: string,
    private readonly body: Array<string>,
    private readonly description: string
  ) {
    this.name = name;
    this.prefix = prefix;
    this.body = body;
    this.description = description;
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

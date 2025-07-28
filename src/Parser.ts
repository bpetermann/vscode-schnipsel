export class Parser {
  public body: Array<string> = [];

  private current: number = 0;

  private currentTabStop: number = 0;

  private source: Array<string>;

  constructor(input: string) {
    this.source = input.trim().split('\n');
    this.parse();
  }

  parse(): void {
    while (this.current < this.source.length) {
      this.parseLine();
    }
  }

  private parseLine() {
    const line = this.advance();

    const handlers: [test: () => boolean, handler: () => void][] = [
      [() => this.isFunction(line), () => this.parseFunction(line)],
      [() => true, () => this.push(line)],
    ];

    for (const [test, handler] of handlers) {
      if (test()) {
        handler();
        break;
      }
    }
  }

  private advance(): Array<string> {
    return this.source[this.current++].split(' ');
  }

  private push(line: Array<string>): void {
    this.body.push(line.join(' '));
  }

  private isFunction(line: Array<string>): boolean {
    return line.includes('function') || line.includes('=>');
  }

  private parseFunction(line: Array<string>) {
    const index = line.findIndex((item) => item === 'function');
    const tabStop = `$${++this.currentTabStop}`;
    const name = line[index + 1] || '';

    if (name.includes('(')) {
      const [_, rest] = name.split('(');
      line[index + 1] = `${tabStop}(${rest}`;
    } else {
      line[index + 1] = tabStop;
    }

    this.push(line);
  }
}

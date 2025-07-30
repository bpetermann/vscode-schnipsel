import { keywords, KeywordType, Tokens } from './types';

export class Parser {
  public body: Array<string> = [];

  private source: Array<string>;
  private currentLine: number = 0;
  private currentTabStop: number = 0;
  private tokens: Tokens = [];
  private tabStops = new Map<string, number>();

  constructor(input: string) {
    this.source = input.trim().split('\n');
    this.parseSource();
  }

  parseSource(): void {
    while (this.currentLine < this.source.length) {
      this.processTokens();
    }
  }

  private processTokens() {
    this.tokens = this.nextTokens();

    const handlers: (() => void)[] = [
      ...keywords.map((key) => () => this.handleDeclaration(key)),
      () => this.replaceTabStopReferences(),
    ];

    handlers.forEach((handler) => handler());

    this.push(this.tokens);
  }

  private nextTokens(): Tokens {
    return this.source[this.currentLine++].split(' ');
  }

  private nextTabStop(): void {
    ++this.currentTabStop;
  }

  private push(tokens: Tokens): void {
    this.body.push(tokens.join(' '));
  }

  private addTabStop(name: string) {
    this.tabStops.set(name, this.currentTabStop);
  }

  private handleDeclaration(key: KeywordType): void {
    const index = this.tokens.findIndex((v) => v === key.toLowerCase());
    const slice = this.tokens.slice(index + 1);
    const nextIndex = slice.findIndex(Boolean);

    if (index === -1 || nextIndex === -1) {
      return;
    }

    this.handleSwitch(key, index, nextIndex);
  }

  private handleSwitch(
    key: KeywordType,
    index: number,
    nextIndex: number
  ): void {
    const nameIndex = index + 1 + nextIndex;
    const name = this.tokens[nameIndex];
    this.nextTabStop();

    this[`handle${key}`](name, nameIndex);
  }

  private handleType(name: string, nameIndex: number): void {
    this.addTabStop(name);
    this.tokens[nameIndex] = `$${this.currentTabStop}`;
  }

  private handleInterface(name: string, nameIndex: number): void {
    this.addTabStop(name);
    this.tokens[nameIndex] = `$${this.currentTabStop}`;
  }

  private handleFunction(name: string, nameIndex: number): void {
    this.tokens[nameIndex] = this.normalizeFunctionName(name);
  }

  private replaceTabStopReferences(): void {
    const updatedTokens = this.tokens.map((item) => {
      for (const [tabStop, id] of this.tabStops) {
        if (item.includes(tabStop)) {
          return item.replace(tabStop, `$${id}`);
        }
      }
      return item;
    });
    this.tokens = updatedTokens;
  }

  private normalizeFunctionName(name: string): string {
    if (name.includes('(')) {
      const [func, rest] = name.split('(');
      this.addTabStop(func);
      return `$${this.currentTabStop}(${rest}`;
    } else {
      this.addTabStop(name);
      return `$${this.currentTabStop}`;
    }
  }
}

import { keywords, KeywordType, TokenHandler, Tokens } from './types';

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

    const handlers: TokenHandler[] = [
      ...keywords.map(
        (keyword) =>
          [
            () => this.containsKeyword(keyword),
            () => this.handleDeclaration(keyword),
          ] as TokenHandler
      ),
      [() => this.isTabStop(), () => this.parseTabStop()],
    ];

    for (const [test, handler] of handlers) {
      if (test()) {
        handler();
      }
    }

    this.push(this.tokens);
  }

  private nextTokens(): Tokens {
    return this.source[this.currentLine++].split(' ');
  }

  private nextTabStop(): number {
    return ++this.currentTabStop;
  }

  private push(tokens: Tokens): void {
    this.body.push(tokens.join(' '));
  }

  private addTabStop(name: string, tab: number) {
    this.tabStops.set(name, tab);
  }

  private containsKeyword(type: KeywordType): boolean {
    return this.tokens.includes(type);
  }

  private isTabStop(): boolean {
    return this.tokens.some((item) =>
      Array.from(this.tabStops.keys()).some((tabStop) => item.includes(tabStop))
    );
  }

  private handleDeclaration(key: KeywordType): void {
    const index = this.tokens.findIndex((value) => value === key);

    const nextTab = this.nextTabStop();
    const slice = this.tokens.slice(index + 1);
    const nextIndex = slice.findIndex(Boolean);

    if (nextIndex === -1) {
      return;
    }

    const nameIndex = index + 1 + nextIndex;
    const name = this.tokens[nameIndex];

    if (key === 'function') {
      this.parseFunction(name, nextTab, nameIndex);
    } else {
      this.parseType(name, nextTab, nameIndex);
    }
  }

  private parseType(name: string, nextTab: number, nameIndex: number): void {
    this.addTabStop(name, nextTab);
    this.tokens[nameIndex] = `$${nextTab}`;
  }

  private parseTabStop() {
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

  private parseFunction(name: string, nextTab: number, nameIndex: number) {
    this.tokens[nameIndex] = this.normalizeFunctionName(name, nextTab);
  }

  private normalizeFunctionName(name: string, nextTab: number): string {
    if (name.includes('(')) {
      const [fnName, rest] = name.split('(');
      this.addTabStop(fnName, nextTab);
      return `$${nextTab}(${rest}`;
    } else {
      this.addTabStop(name, nextTab);
      return `$${nextTab}`;
    }
  }
}

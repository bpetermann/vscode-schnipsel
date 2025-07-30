import { keywords, KeywordType, KnownProcessorMethod, Tokens } from './types';

/**
 * Parses source code to transform it into a VS Code snippet body format,
 * identifying declarations and generating tab stops for them.
 */
export class Parser {
  public body: Array<string> = [];

  private sourceLines: Array<string>;
  private currentLineIndex: number = 0;
  private nextTapStopId: number = 0;
  private currentLineTokens: Tokens = [];
  private tabStopMap = new Map<string, number>();

  private readonly keywordProcessors: Map<KeywordType, KnownProcessorMethod>;

  constructor(input: string) {
    this.sourceLines = input.trim().split('\n');
    this.keywordProcessors = new Map([
      ['type', this.processGenericDeclaration.bind(this)],
      ['interface', this.processGenericDeclaration.bind(this)],
      ['function', this.processFunction.bind(this)],
    ]);
    this.processAllLines();
  }

  private processAllLines(): void {
    while (this.currentLineIndex < this.sourceLines.length) {
      this.processCurrentLine();
    }
  }

  private processCurrentLine(): void {
    this.currentLineTokens = this.getCurrentLineTokens();

    keywords.forEach((key) => {
      if (
        this.currentLineTokens.includes(key.toLowerCase()) &&
        this.keywordProcessors.has(key)
      ) {
        this.handleKeywordDeclaration(key);
      }
    });

    this.applyTabStops();

    this.appendProcessedLine(this.currentLineTokens);
  }

  private getCurrentLineTokens(): Tokens {
    return this.sourceLines[this.currentLineIndex++].split(' ');
  }

  private generateNextTabStopId(): number {
    return ++this.nextTapStopId;
  }

  private appendProcessedLine(tokens: Tokens): void {
    this.body.push(tokens.join(' '));
  }

  private registerTabStop(name: string, tabId: number) {
    this.tabStopMap.set(name, tabId);
  }

  private handleKeywordDeclaration(key: KeywordType): void {
    const keywordIndex = this.currentLineTokens.findIndex((v) => v === key);
    const tokensAfterKeyword = this.currentLineTokens.slice(keywordIndex + 1);
    const nameOffsetInSlice = tokensAfterKeyword.findIndex(Boolean);

    if (keywordIndex === -1 || nameOffsetInSlice === -1) {
      return;
    }

    const nameTokenIndex = keywordIndex + 1 + nameOffsetInSlice;
    const declaredName = this.currentLineTokens[nameTokenIndex];
    const newTabStopId = this.generateNextTabStopId();

    this.invokeKeywordProcessor(
      key,
      declaredName,
      nameTokenIndex,
      newTabStopId
    );
  }

  private invokeKeywordProcessor(
    key: KeywordType,
    name: string,
    nextIndex: number,
    newTabStopId: number
  ): void {
    const processor = this.keywordProcessors.get(key);

    if (processor) {
      processor(name, nextIndex, newTabStopId);
    }
  }

  private processGenericDeclaration(
    name: string,
    index: number,
    tabId: number
  ): void {
    this.registerTabStop(name, tabId);
    this.currentLineTokens[index] = `$${tabId}`;
  }

  private processFunction(name: string, index: number, tabId: number): void {
    this.currentLineTokens[index] = this.normalizeFunctionName(name, tabId);
  }

  private applyTabStops(): void {
    const updatedTokens = this.currentLineTokens.map((item) => {
      for (const [tabStop, id] of this.tabStopMap) {
        if (item.includes(tabStop)) {
          return item.replace(tabStop, `$${id}`);
        }
      }
      return item;
    });
    this.currentLineTokens = updatedTokens;
  }

  private normalizeFunctionName(name: string, tabId: number): string {
    if (name.includes('(')) {
      const [func, rest] = name.split('(');
      this.registerTabStop(func, tabId);
      return `$${tabId}(${rest}`;
    } else {
      this.registerTabStop(name, tabId);
      return `$${tabId}`;
    }
  }
}

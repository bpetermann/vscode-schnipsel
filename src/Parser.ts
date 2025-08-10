import {
  EMPTY_TOKEN,
  keywords,
  KeywordType,
  KnownProcessorMethod,
  Tokens,
} from './types';

/**
 * Parses source code to transform it into a VS Code snippet body format,
 * identifying declarations and generating tab stops for them.
 */
export class Parser {
  public body: Array<string> = [];

  private sourceLines: Array<string>;
  private currentLineIndex: number = 0;
  private nextTabStopId: number = 0;
  private currentLineTokens: Tokens = [];
  private tabStopMap = new Map<string, string>();

  private readonly keywordProcessors: Map<KeywordType, KnownProcessorMethod>;

  constructor(input: string) {
    this.sourceLines = input.trim().split('\n');
    this.keywordProcessors = new Map([
      ['type', this.processGenericDeclaration.bind(this)],
      ['interface', this.processGenericDeclaration.bind(this)],
      ['function', this.processFunction.bind(this)],
      ['class', this.processClass.bind(this)],
      ['const', this.processConst.bind(this)],
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

    this.applyTabStops();

    keywords.forEach((key) => {
      if (
        this.currentLineTokens.includes(key.toLowerCase()) &&
        this.keywordProcessors.has(key)
      ) {
        this.handleKeywordDeclaration(key);
      }
    });

    this.appendProcessedLine(this.currentLineTokens);
  }

  private getCurrentLineTokens(): Tokens {
    return this.sourceLines[this.currentLineIndex++].split(' ');
  }

  private generateNextTabStopId(): number {
    return ++this.nextTabStopId;
  }

  private resetTabStopId(): number {
    return --this.nextTabStopId;
  }

  private appendProcessedLine(tokens: Tokens): void {
    this.body.push(tokens.join(' '));
  }

  private registerTabStop(name: string, value: string) {
    this.tabStopMap.set(name, value);
  }

  private generatePlaceholder(id: number, name: string): string {
    return `\${${id}:${name}}`;
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
    this.registerTabStop(name, `$${tabId}`);
    this.currentLineTokens[index] = this.generatePlaceholder(tabId, name);
  }

  private processFunction(name: string, index: number, tabId: number): void {
    this.currentLineTokens[index] = this.normalizeNameWithSuffix(
      name,
      tabId,
      '('
    );
  }

  private processClass(name: string, index: number, tabId: number): void {
    this.currentLineTokens[index] = this.normalizeNameWithSuffix(
      name,
      tabId,
      '{'
    );
  }

  private processConst(name: string, index: number, tabId: number): void {
    if (this.isArrowFunctionPattern(index)) {
      this.registerTabStop(name, `$${tabId}`);
      this.currentLineTokens[index] = this.generatePlaceholder(tabId, name);
    } else {
      this.resetTabStopId();
    }
  }

  private applyTabStops(): void {
    const updatedTokens = this.currentLineTokens.map((item, index) => {
      for (const [tabStop, value] of this.tabStopMap) {
        if (
          this.isWholeWordMatch(item, tabStop) &&
          !this.isObjectPropertyKey(item) &&
          !this.isStringLiteral(item)
        ) {
          return item.replace(tabStop, value);
        }
      }

      return item;
    });
    this.currentLineTokens = updatedTokens;
  }

  private isWholeWordMatch(item: string, tabStop: string): boolean {
    return new RegExp(`\\b${tabStop}\\b`).test(item);
  }

  private isObjectPropertyKey(item: string): boolean {
    return item.endsWith(':');
  }

  private isStringLiteral(item: string): item is `"${string}"` | `'${string}'` {
    return (
      (item.startsWith("'") && item.endsWith("'")) ||
      (item.startsWith('"') && item.endsWith('"'))
    );
  }

  private isArrowFunctionPattern(index: number): boolean {
    const [next, i] = this.peekToken(index + 1);
    const [afterNext] = this.peekToken(i + 1);

    return next === '=' && (afterNext.startsWith('(') || afterNext === 'async');
  }

  /**
   * Returns the next non-empty token and its actual index in the token list.
   * Skips over empty strings (e.g. from irregular spacing).
   */
  private peekToken(startIndex: number): [token: string, index: number] {
    for (let i = startIndex; i < this.currentLineTokens.length; i++) {
      const token = this.currentLineTokens[i];
      if (token.trim() !== EMPTY_TOKEN) {
        return [token, i];
      }
    }
    return [EMPTY_TOKEN, -1];
  }

  private normalizeNameWithSuffix(
    name: string,
    tabId: number,
    delimiter: '(' | '{'
  ): string {
    if (name.includes(delimiter)) {
      const [func, rest] = name.split(delimiter);
      this.registerTabStop(func, `$${tabId}`);
      return this.generatePlaceholder(tabId, func) + `(${rest}`;
    } else {
      this.registerTabStop(name, `$${tabId}`);
      return this.generatePlaceholder(tabId, name);
    }
  }
}

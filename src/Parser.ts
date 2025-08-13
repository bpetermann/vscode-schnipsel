import {
  ClassProcessor,
  ConstProcessor,
  DeclarationProcessor,
  FunctionProcessor,
} from './Processor';
import { TabStop } from './TabStop';
import {
  Config,
  keywords,
  KeywordType,
  ProcessorConstructor,
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

  private readonly keywordProcessors: Map<KeywordType, ProcessorConstructor>;

  constructor(input: string, private readonly config: Config) {
    this.sourceLines = input.trim().split('\n');
    this.keywordProcessors = new Map<KeywordType, ProcessorConstructor>([
      ['type', DeclarationProcessor],
      ['interface', DeclarationProcessor],
      ['function', FunctionProcessor],
      ['class', ClassProcessor],
      ['const', ConstProcessor],
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

  private handleKeywordDeclaration(key: KeywordType): void {
    const keywordIndex = this.currentLineTokens.findIndex((v) => v === key);
    const tokensAfterKeyword = this.currentLineTokens.slice(keywordIndex + 1);
    const nameOffsetInSlice = tokensAfterKeyword.findIndex(Boolean);

    if (keywordIndex === -1 || nameOffsetInSlice === -1) {
      return;
    }

    const variableIndex = keywordIndex + 1 + nameOffsetInSlice;
    const variable = this.currentLineTokens[variableIndex];

    this.invokeKeywordProcessor(key, variable, variableIndex);
  }

  private invokeKeywordProcessor(
    key: KeywordType,
    variable: string,
    variableIndex: number
  ): void {
    const processor = this.keywordProcessors.get(key);

    if (processor) {
      const newTabStopId = this.generateNextTabStopId();

      const ts = new TabStop(
        variable,
        variableIndex,
        newTabStopId,
        this.config.placeholder
      );

      const { tokens, tabStop } = new processor(
        this.currentLineTokens,
        ts
      ).process();

      this.currentLineTokens = tokens;

      if (tabStop.shouldRegister()) {
        this.registerTabStop(tabStop.name, tabStop.value);
      } else {
        this.resetTabStopId();
      }
    }
  }

  private applyTabStops(): void {
    const updatedTokens = this.currentLineTokens.map((item) => {
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

  private getCurrentLineTokens(): Tokens {
    return this.sourceLines[this.currentLineIndex++].split(' ');
  }

  private generateNextTabStopId(): number {
    return ++this.nextTabStopId;
  }

  /**
   * Resets the next tab stop ID, typically used when a processor
   * doesn't generate a tab stop after an ID has been assigned.
   */
  private resetTabStopId(): number {
    return --this.nextTabStopId;
  }

  private appendProcessedLine(tokens: Tokens): void {
    this.body.push(tokens.join(' '));
  }

  private registerTabStop(name: string, value: string) {
    this.tabStopMap.set(name, value);
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
}

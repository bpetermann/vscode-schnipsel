import { TabStopReplacer } from './Replacer';
import { TabStop } from './TabStop';
import { Config, Language, Tokens } from './types';
import { ProcessorRegistry } from './ProcessorRegistry';

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

  private readonly registry = new ProcessorRegistry();

  constructor(
    input: string,
    private readonly config: Config,
    private readonly language?: Language
  ) {
    this.sourceLines = this.toLines(input);
    this.processAllLines();
  }

  private processAllLines(): void {
    while (this.currentLineIndex < this.sourceLines.length) {
      this.processCurrentLine();
    }
  }

  private processCurrentLine(): void {
    this.currentLineTokens = this.getCurrentLineTokens();

    const replacer = new TabStopReplacer(
      this.currentLineTokens,
      this.tabStopMap
    );

    this.currentLineTokens = replacer.apply();

    this.registry.keywords().forEach((key) => {
      if (this.currentLineTokens.includes(key)) {
        this.handleKeywordDeclaration(key);
      }
    });

    this.appendProcessedLine(this.currentLineTokens);
  }

  private handleKeywordDeclaration(key: string): void {
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
    key: string,
    variable: string,
    variableIndex: number
  ): void {
    const processor = this.registry.get(key);

    if (processor && !/^\$[\d{]/.test(variable)) {
      const newTabStopId = this.generateNextTabStopId();

      const ts = new TabStop(
        variable,
        variableIndex,
        newTabStopId,
        this.config.placeholder
      );

      const { tokens, tabStop } = new processor(
        this.currentLineTokens,
        ts,
        this.language
      ).process();

      this.currentLineTokens = tokens;

      if (tabStop.shouldRegister()) {
        this.registerTabStop(tabStop.name, tabStop.value);
      } else {
        this.resetTabStopId();
      }
    }
  }

  /**
   * Normalizes line endings and splits the input into individual lines,
   * trimming leading and trailing whitespace from the whole input.
   * Handles both Unix (LF) and Windows (CRLF) line endings.
   */
  private toLines(input: string): Array<string> {
    return input.trim().replace(/\r\n/g, '\n').split('\n');
  }

  private getCurrentLineTokens(): Tokens {
    return this.sourceLines[this.currentLineIndex++].split(' ');
  }

  private generateNextTabStopId(): number {
    return ++this.nextTabStopId;
  }

  private appendProcessedLine(tokens: Tokens): void {
    this.body.push(tokens.join(' '));
  }

  private registerTabStop(name: string, value: string) {
    this.tabStopMap.set(name, value);
  }

  /**
   * Resets the next tab stop ID, typically used when a processor
   * doesn't generate a tab stop after an ID has been assigned.
   */
  private resetTabStopId(): number {
    return --this.nextTabStopId;
  }
}

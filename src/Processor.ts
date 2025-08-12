import { EMPTY_TOKEN } from './types';

export interface ProcessorOutput {
  tokens: string[];
  identifier: string;
  tabStop: string | null;
}

export interface Processor {
  process(): ProcessorOutput;
}

export class BaseProcessor {
  constructor(
    protected tokens: string[],
    protected name: string,
    protected index: number,
    protected tabId: number,
    protected placeholder: boolean = true
  ) {}

  /**
   * Generates either a tab stop or a placeholder depending on `placeholder`.
   * If `name` is provided and placeholders are enabled, returns `${tabId:name}`,
   * otherwise returns `$tabId`.
   */
  protected generateTabStopText(tabId: number): string;
  protected generateTabStopText(tabId: number, name: string): string;
  protected generateTabStopText(tabId: number, name?: string): string {
    return name && this.placeholder ? `\${${tabId}:${name}}` : `$${tabId}`;
  }

  protected normalizeNameWithSuffix(tabId: number, delimiter: string): string {
    const delimiterIndex = this.name.indexOf(delimiter);
    if (delimiterIndex !== -1) {
      const base = this.name.slice(0, delimiterIndex);
      const rest = this.name.slice(delimiterIndex);
      this.name = base;
      return this.generateTabStopText(tabId, base) + rest;
    }
    return this.generateTabStopText(tabId, this.name);
  }

  protected createOutput(tabStop: string | null): ProcessorOutput {
    return {
      tabStop,
      tokens: this.tokens,
      identifier: this.name,
    };
  }
}

export class DeclarationProcessor extends BaseProcessor implements Processor {
  process(): ProcessorOutput {
    this.tokens[this.index] = this.generateTabStopText(this.tabId, this.name);
    return this.createOutput(this.generateTabStopText(this.tabId));
  }
}

export class FunctionProcessor extends BaseProcessor implements Processor {
  process(): ProcessorOutput {
    this.tokens[this.index] = this.normalizeNameWithSuffix(this.tabId, '(');
    return this.createOutput(this.generateTabStopText(this.tabId));
  }
}

export class ClassProcessor extends BaseProcessor implements Processor {
  process(): ProcessorOutput {
    this.tokens[this.index] = this.normalizeNameWithSuffix(this.tabId, '{');
    return this.createOutput(this.generateTabStopText(this.tabId));
  }
}

export class ConstProcessor extends BaseProcessor implements Processor {
  process(): ProcessorOutput {
    const isArrowFunctionPattern = this.isArrowFunctionPattern(this.index);

    if (isArrowFunctionPattern) {
      this.tokens[this.index] = this.generateTabStopText(this.tabId, this.name);
    }

    return this.createOutput(
      isArrowFunctionPattern ? this.generateTabStopText(this.tabId) : null
    );
  }

  private isArrowFunctionPattern(index: number): boolean {
    const [next, nextIndex] = this.peekToken(index + 1);
    const [afterNext] = this.peekToken(nextIndex + 1);

    const isAssignment = next === '=';
    const isArrowStart = afterNext.startsWith('(') || afterNext === 'async';

    return isAssignment && isArrowStart;
  }

  /**
   * Returns the next non-empty token and its actual index in the token list.
   * Skips over empty strings (e.g. from irregular spacing).
   */
  private peekToken(startIndex: number): [token: string, index: number] {
    for (let i = startIndex; i < this.tokens.length; i++) {
      const token = this.tokens[i];
      if (token.trim() !== EMPTY_TOKEN) {
        return [token, i];
      }
    }
    return [EMPTY_TOKEN, -1];
  }
}

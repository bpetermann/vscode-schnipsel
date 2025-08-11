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
    protected tabId: number
  ) {}

  protected generatePlaceholder(id: number, name: string): string {
    return `\${${id}:${name}}`;
  }

  protected formatTabStop(tabId: number): string {
    return `$${tabId}`;
  }

  protected normalizeNameWithSuffix(tabId: number, delimiter: string): string {
    if (this.name.includes(delimiter)) {
      const [base, rest] = this.name.split(delimiter, 2);
      this.name = base;
      return this.generatePlaceholder(tabId, base) + delimiter + rest;
    }
    return this.generatePlaceholder(tabId, this.name);
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
  constructor(
    tokens: Array<string>,
    name: string,
    index: number,
    tabId: number
  ) {
    super(tokens, name, index, tabId);
  }

  process(): ProcessorOutput {
    this.tokens[this.index] = this.generatePlaceholder(this.tabId, this.name);
    return this.createOutput(this.formatTabStop(this.tabId));
  }
}

export class FunctionProcessor extends BaseProcessor implements Processor {
  constructor(
    tokens: Array<string>,
    name: string,
    index: number,
    tabId: number
  ) {
    super(tokens, name, index, tabId);
  }

  process(): ProcessorOutput {
    this.tokens[this.index] = this.normalizeNameWithSuffix(this.tabId, '(');
    return this.createOutput(this.formatTabStop(this.tabId));
  }
}

export class ClassProcessor extends BaseProcessor implements Processor {
  constructor(
    tokens: Array<string>,
    name: string,
    index: number,
    tabId: number
  ) {
    super(tokens, name, index, tabId);
  }

  process(): ProcessorOutput {
    this.tokens[this.index] = this.normalizeNameWithSuffix(this.tabId, '{');
    return this.createOutput(this.formatTabStop(this.tabId));
  }
}

export class ConstProcessor extends BaseProcessor implements Processor {
  constructor(
    tokens: Array<string>,
    name: string,
    index: number,
    tabId: number
  ) {
    super(tokens, name, index, tabId);
  }

  process(): ProcessorOutput {
    const isArrowFunctionPattern = this.isArrowFunctionPattern(this.index);

    if (isArrowFunctionPattern) {
      this.tokens[this.index] = this.generatePlaceholder(this.tabId, this.name);
    }

    return this.createOutput(
      isArrowFunctionPattern ? this.formatTabStop(this.tabId) : null
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

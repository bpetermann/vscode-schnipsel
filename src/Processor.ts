import { TabStop } from './TabStop';
import { EMPTY_TOKEN } from './types';

export interface Processor {
  tokens: string[];
  tabStop: TabStop;
  process(): this;
}

export class BaseProcessor {
  constructor(public tokens: string[], public tabStop: TabStop) {}

  /**
   * Splits a variable name into a base name and a suffix based on a given delimiter.
   * This is used to handle declarations that might contain symbols like parentheses or braces.
   */
  protected normalizeNameWithSuffix(
    delimiter: string,
    variable: string
  ): [name: string, suffix: string] {
    let name = variable;
    let rest = '';

    const delimiterIndex = name.indexOf(delimiter);

    if (delimiterIndex !== -1) {
      name = variable.slice(0, delimiterIndex);
      rest = variable.slice(delimiterIndex);
    }

    return [name, rest];
  }

  /**
   * Returns the next non-empty token and its actual index in the token list.
   * Skips over empty strings (e.g. from irregular spacing).
   */
  protected peekToken(startIndex: number): [token: string, index: number] {
    for (let i = startIndex; i < this.tokens.length; i++) {
      const token = this.tokens[i];
      if (token.trim() !== EMPTY_TOKEN) {
        return [token, i];
      }
    }
    return [EMPTY_TOKEN, -1];
  }
}

export class DeclarationProcessor extends BaseProcessor implements Processor {
  process(): this {
    this.tokens[this.tabStop.index] = this.tabStop.placeholder;
    return this;
  }
}

export class FunctionProcessor extends BaseProcessor implements Processor {
  process(): this {
    const [name, rest] = this.normalizeNameWithSuffix('(', this.tabStop.name);
    this.tabStop.name = name;
    this.tokens[this.tabStop.index] = this.tabStop.placeholder + rest;
    return this;
  }
}

export class ClassProcessor extends BaseProcessor implements Processor {
  process(): this {
    const [name, rest] = this.normalizeNameWithSuffix('{', this.tabStop.name);
    this.tabStop.name = name;
    this.tokens[this.tabStop.index] = this.tabStop.placeholder + rest;
    return this;
  }
}

export class ConstProcessor extends BaseProcessor implements Processor {
  process(): this {
    const isArrowFunctionPattern = this.isArrowFunctionPattern();

    if (isArrowFunctionPattern) {
      this.tokens[this.tabStop.index] = this.tabStop.placeholder;
    } else {
      this.tabStop.disable();
    }

    return this;
  }

  private isArrowFunctionPattern(): boolean {
    const [next, nextIndex] = this.peekToken(this.tabStop.index + 1);
    const [afterNext] = this.peekToken(nextIndex + 1);

    const isAssignment = next === '=';
    const isArrowStart = afterNext.startsWith('(') || afterNext === 'async';

    return isAssignment && isArrowStart;
  }
}

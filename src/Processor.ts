import { TabStop } from './TabStop';
import { EMPTY_TOKEN, Language, Tokens } from './types';

export interface Processor {
  tokens: Tokens;
  tabStop: TabStop;
  readonly language?: Language;
  process(): this;
}

export class BaseProcessor {
  constructor(
    public tokens: Tokens,
    public tabStop: TabStop,
    readonly language?: Language
  ) {}

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

  /** Replace the current tab stop token with its placeholder. */
  protected replaceWithPlaceholder(additionalText: string = ''): void {
    this.tokens[this.tabStop.index] = this.tabStop.placeholder + additionalText;
  }

  /** Check if the current language is React-flavored (TSX or JSX). */
  protected isReact(): boolean {
    return (
      this.language === 'typescriptreact' || this.language === 'javascriptreact'
    );
  }
}

export class DeclarationProcessor extends BaseProcessor implements Processor {
  process(): this {
    this.replaceWithPlaceholder();
    return this;
  }
}

export class FunctionProcessor extends BaseProcessor implements Processor {
  process(): this {
    const [name, rest] = this.normalizeNameWithSuffix('(', this.tabStop.name);
    this.tabStop.name = name;
    this.replaceWithPlaceholder(rest);
    return this;
  }
}

export class ClassProcessor extends BaseProcessor implements Processor {
  process(): this {
    const [name, rest] = this.normalizeNameWithSuffix('{', this.tabStop.name);
    this.tabStop.name = name;
    this.replaceWithPlaceholder(rest);
    return this;
  }
}

export class ConstProcessor extends BaseProcessor implements Processor {
  private patterns: Array<(next: string) => boolean> = [
    this.isArrowFunctionPattern,
    this.isContextName,
    this.isForwardRef,
    this.isMemo,
    this.isLazy,
  ];

  process(): this {
    this.ensureAssignment();
    return this;
  }

  private ensureAssignment(): void {
    const [next, nextIndex] = this.peekToken(this.tabStop.index + 1);

    if (next !== '=') {
      this.tabStop.disable();
      return;
    }

    this.checkPattern(nextIndex);
  }

  private checkPattern(index: number): void {
    const [afterNext] = this.peekToken(index + 1);

    if (this.patterns.some((fn) => fn.call(this, afterNext))) {
      this.replaceWithPlaceholder();
    } else {
      this.tabStop.disable();
    }
  }

  private isArrowFunctionPattern(next: string): boolean {
    return next.startsWith('(') || next === 'async';
  }

  private isContextName(next: string): boolean {
    return this.isReact() && next.startsWith('createContext');
  }

  private isForwardRef(next: string): boolean {
    return this.isReact() && next.startsWith('forwardRef');
  }

  private isMemo(next: string): boolean {
    return this.isReact() && next.startsWith('memo');
  }

  private isLazy(next: string): boolean {
    return this.isReact() && next.startsWith('lazy');
  }
}

export class ImportProcessor extends BaseProcessor implements Processor {
  process(): this {
    if (this.isDefaultImportSyntax()) {
      this.replaceWithPlaceholder();
      this.replaceFileNameWithTabStop();
    } else {
      this.tabStop.disable();
    }

    return this;
  }

  private isDefaultImportSyntax(): boolean {
    // Skip "React from 'react'"
    if (!this.isReact() || this.tabStop.name === 'React') {
      return false;
    }

    const [next] = this.peekToken(this.tabStop.index + 1);

    return next === 'from';
  }

  private replaceFileNameWithTabStop(): void {
    const fromIndex = this.tokens.indexOf('from');
    if (fromIndex !== -1 && fromIndex + 1 < this.tokens.length) {
      const fileTokenIndex = fromIndex + 1;
      this.tokens[fileTokenIndex] = this.tokens[fileTokenIndex].replace(
        this.tabStop.name,
        this.tabStop.value
      );
    }
  }
}

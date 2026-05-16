import { TabStop } from './TabStop';
import { Language, ProcessorConstructor, Tokens } from './types';

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
    readonly language?: Language,
  ) {}

  /**
   * Splits a variable name into a base name and a suffix based on a given delimiter.
   * This is used to handle declarations that might contain symbols like parentheses or braces.
   */
  protected normalizeNameWithSuffix(
    delimiter: string,
    variable: string,
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

function makeSimpleProcessor(delimiter?: string): ProcessorConstructor {
  return class extends BaseProcessor implements Processor {
    process(): this {
      if (delimiter !== undefined) {
        const [name, rest] = this.normalizeNameWithSuffix(
          delimiter,
          this.tabStop.name,
        );
        this.tabStop.name = name;
        this.replaceWithPlaceholder(rest);
      } else {
        this.replaceWithPlaceholder();
      }
      return this;
    }
  };
}

export const DeclarationProcessor = makeSimpleProcessor();
export const FunctionProcessor = makeSimpleProcessor('(');
export const ClassProcessor = makeSimpleProcessor('{');

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
    const nextIndex = this.tabStop.index + 1;

    if (this.tokens[nextIndex] !== '=') {
      this.tabStop.disable();
      return;
    }

    this.checkPattern(nextIndex);
  }

  private checkPattern(index: number): void {
    const afterNext = this.tokens[index + 1] ?? '';

    if (this.patterns.some((fn) => fn.call(this, afterNext))) {
      this.replaceWithPlaceholder();
    } else {
      this.tabStop.disable();
    }
  }

  private isArrowFunctionPattern(next: string): boolean {
    return (
      (next.startsWith('(') || next === 'async') && this.tokens.includes('=>')
    );
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
    // Skip "import React from 'react'"
    if (this.tabStop.name === 'React') {
      return false;
    }

    return this.tokens[this.tabStop.index + 1] === 'from';
  }

  private replaceFileNameWithTabStop(): void {
    const fromIndex = this.tokens.indexOf('from');
    if (fromIndex !== -1 && fromIndex + 1 < this.tokens.length) {
      const fileTokenIndex = fromIndex + 1;
      const namePattern = new RegExp(`([/'])${this.tabStop.name}(['"])`);
      const value = this.tabStop.value;

      this.tokens[fileTokenIndex] = this.tokens[fileTokenIndex].replace(
        namePattern,
        (_, pre, post) => `${pre}${value}${post}`,
      );
    }
  }
}

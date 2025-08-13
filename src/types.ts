import { Parser } from './Parser';
import { Processor } from './Processor';
import { Snippet } from './Snippet';
import { TabStop } from './TabStop';

export type Tokens = Array<string>;

export const EMPTY_TOKEN = '' as const;

export const keywords = [
  'function',
  'type',
  'interface',
  'class',
  'const',
] as const;

export type KeywordType = (typeof keywords)[number];

export interface Config {
  placeholder: boolean;
}

/**
 * Constructor signature for any class that implements the {@link Processor} interface.
 * @param tokens The array of tokenized source code that the processor will mutate in place.
 * @param tabStop A TabStop instance containing metadata and formatting logic for the target name token (its text, position, tab stop ID, and whether to use a placeholder).
 * @returns A processor instance ready to process the provided tokens.
 */
export type ProcessorConstructor = new (
  tokens: string[],
  tabStop: TabStop
) => Processor;

/**
 * Type definition for a function that creates a Parser instance.
 * @param text The input text for the Parser.
 * @param config A configuration object, which determines whether placeholders are used.
 */
export type ParserFactory = (text: string, config: Config) => Parser;

/**
 * Type definition for a function that creates a Snippet instance.
 * @param body The array of strings forming the snippet body.
 * @param language The language ID for the snippet.
 * @param name The name/prefix for the snippet.
 */
export type SnippetFactory = (
  body: string[],
  language: string,
  name: string
) => Snippet;

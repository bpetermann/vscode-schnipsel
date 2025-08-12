import { Parser } from './Parser';
import { Processor } from './Processor';
import { Snippet } from './Snippet';

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
 * A constructor signature for classes that implement the {@link Processor} interface.
 * @param tokens The tokenized source code array that will be mutated by the processor.
 * @param name The name token (e.g., function name, class name, const variable name) at the given index.
 * @param index The position of the `name` token within the `tokens` array.
 * @param tabId The ID for the placeholder/tab stop to be inserted by the processor.
 * @param placeholder Whether a placeholder should be used.
 * @returns An instance of a processor ready to process the given tokens.
 */
export type ProcessorConstructor = new (
  tokens: string[],
  name: string,
  index: number,
  tabId: number,
  placeholder: boolean
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

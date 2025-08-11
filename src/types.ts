import { Parser } from './Parser';
import { Processor } from './Processor';
import { Snippet } from './Snippet';

export type Tokens = Array<string>;

export type TokenHandler = [test: () => boolean, handler: () => void];

export const EMPTY_TOKEN = '' as const;

export const keywords = [
  'function',
  'type',
  'interface',
  'class',
  'const',
] as const;

export type KeywordType = (typeof keywords)[number];

export type KnownProcessorMethod = (
  name: string,
  index: number,
  nextIndex: number
) => void;

export type ProcessorConstructor = new (
  tokens: string[],
  name: string,
  index: number,
  tabId: number
) => Processor;

/**
 * Type definition for a function that creates a Parser instance.
 * @param text The input text for the Parser.
 */
export type ParserFactory = (text: string) => Parser;

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

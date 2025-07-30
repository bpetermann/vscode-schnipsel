export type Tokens = Array<string>;

export type TokenHandler = [test: () => boolean, handler: () => void];

export const keywords = ['function', 'type', 'interface'] as const;

export type KeywordType = (typeof keywords)[number];

export type KnownProcessorMethod = (
  name: string,
  index: number,
  nextIndex: number
) => void;

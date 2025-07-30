export type Tokens = Array<string>;

export type TokenHandler = [test: () => boolean, handler: () => void];

export const keywords = ['Function', 'Type', 'Interface'] as const;

export type KeywordType = (typeof keywords)[number];

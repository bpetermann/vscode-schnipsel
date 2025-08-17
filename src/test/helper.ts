import { ImportProcessor } from '../Processor';
import { TabStop } from '../TabStop';
import { Language } from '../types';

export const createProcessor = (
  tokens: string[],
  name: string,
  value: number,
  language: Language = 'typescriptreact'
) => {
  const tabStop = new TabStop(name, value, tokens.indexOf(name));
  return new ImportProcessor(tokens, tabStop, language);
};

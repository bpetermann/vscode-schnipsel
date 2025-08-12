import { ExtensionContext } from 'vscode';
import { Parser } from './Parser';
import { Service } from './Service';
import { Snippet } from './Snippet';
import { ParserFactory, SnippetFactory } from './types';

const parseFactory: ParserFactory = (...args): Parser => new Parser(...args);
const snippetFactory: SnippetFactory = (...args) => new Snippet(...args);

export function activate(context: ExtensionContext) {
  new Service(context, parseFactory, snippetFactory).registerCommands();
}

export function deactivate() {}

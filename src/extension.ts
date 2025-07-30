import * as vscode from 'vscode';
import { Parser } from './Parser';
import { Service } from './Service';
import { Snippet } from './Snippet';
import { ParserFactory, SnippetFactory } from './types';

export function activate(context: vscode.ExtensionContext) {
  const parseFactory: ParserFactory = (text: string): Parser =>
    new Parser(text);
  const snippetFactory: SnippetFactory = (body, language, name) =>
    new Snippet(body, language, name);

  const service = new Service(context, parseFactory, snippetFactory);
  service.registerCommands();
}

export function deactivate() {}

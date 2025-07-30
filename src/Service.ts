import path from 'path';
import * as vscode from 'vscode';
import {
  COMMAND,
  MESSAGES,
  OPEN_SNIPPETS,
  SUPPORTED_LANGUAGES,
} from './constants';
import { ParserFactory, SnippetFactory } from './types';

export class Service {
  constructor(
    private context: vscode.ExtensionContext,
    private parseFactory: ParserFactory,
    private snippetFactory: SnippetFactory
  ) {}

  registerCommands() {
    const command = vscode.commands.registerCommand(
      COMMAND,
      this.copyCodeAsSnippet,
      this
    );
    this.context.subscriptions.push(command);
  }

  async copyCodeAsSnippet() {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      this.showError(MESSAGES.MISSING_EDITOR);
      return;
    }

    if (!this.isSupported(editor)) {
      this.showError(MESSAGES.NOT_SUPPORTED);
      return;
    }

    try {
      const snippet = this.generateSnippet(editor);
      await vscode.env.clipboard.writeText(snippet);
      this.showInfo();
    } catch (e) {
      console.error(MESSAGES.ERROR, e);
      this.showError(MESSAGES.FAIL);
    }
  }

  private getEditorContent(editor: vscode.TextEditor): string {
    const { selection, document } = editor;

    return document.getText(
      ...(selection && !selection.isEmpty ? [selection] : [])
    );
  }

  private generateSnippet(editor: vscode.TextEditor): string {
    const [language, name] = this.getMeta(editor);
    const { body } = this.parseFactory(this.getEditorContent(editor));
    const snippet = this.snippetFactory(body, language, name);
    return snippet.toString();
  }

  private getMeta({ document }: vscode.TextEditor): [string, string] {
    const language = document.languageId;
    const filename = path.parse(document.uri.fsPath).name;

    return [language, filename];
  }

  async showInfo() {
    const choice = await vscode.window.showInformationMessage(
      MESSAGES.SUCCESS,
      MESSAGES.OPEN,
      MESSAGES.Dismiss
    );

    if (choice === MESSAGES.OPEN) {
      await vscode.commands.executeCommand(OPEN_SNIPPETS);
    }
  }

  private isSupported(editor: vscode.TextEditor): boolean {
    return SUPPORTED_LANGUAGES.includes(editor.document.languageId);
  }

  private showError(message: string): void {
    vscode.window.showErrorMessage(message);
  }
}

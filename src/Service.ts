import path from 'path';
import * as vscode from 'vscode';
import {
  COMMAND,
  MESSAGES,
  OPEN_SNIPPETS,
  SUPPORTED_LANGUAGES,
} from './constants';
import { Parser } from './Parser';
import { Snippet } from './Snippet';
export class Service {
  constructor(private context: vscode.ExtensionContext) {}

  init() {
    const command = vscode.commands.registerCommand(COMMAND, this.copy, this);
    this.context.subscriptions.push(command);
  }

  async copy() {
    const editor = vscode.window.activeTextEditor;

    if (!editor || !this.isSupported(editor)) {
      this.showError(
        !editor ? MESSAGES.MISSING_EDITOR : MESSAGES.NOT_SUPPORTED
      );
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

  private getText(editor: vscode.TextEditor): string {
    const { selection, document } = editor;

    return document.getText(
      ...(selection && !selection.isEmpty ? [selection] : [])
    );
  }

  private generateSnippet(editor: vscode.TextEditor): string {
    const [language, name] = this.getMeta(editor);
    const { body } = new Parser(this.getText(editor));
    return new Snippet(body, language, name).toString();
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

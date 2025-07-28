import * as vscode from 'vscode';
import {
  COMMAND,
  FAIL,
  MISSING_EDITOR,
  OPEN_SNIPPETS,
  SUCCESS,
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

    if (!editor) {
      this.showError(MISSING_EDITOR);
      return;
    }

    try {
      const { body } = new Parser(this.getText(editor));
      const snippet = new Snippet(body).toString();

      await vscode.env.clipboard.writeText(snippet);
      this.showInfo();
    } catch {
      this.showError(FAIL);
    }
  }

  private getText(editor: vscode.TextEditor): string {
    const { selection, document } = editor;

    return document.getText(
      ...(selection && !selection.isEmpty ? [selection] : [])
    );
  }

  async showInfo() {
    const open = 'Open snippet file';

    const choice = await vscode.window.showInformationMessage(SUCCESS, open);

    if (choice === open) {
      await vscode.commands.executeCommand(OPEN_SNIPPETS);
    }
  }

  private showError(message: string): void {
    vscode.window.showErrorMessage(message);
  }
}

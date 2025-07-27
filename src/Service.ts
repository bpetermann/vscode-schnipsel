import * as vscode from 'vscode';
import { COMMAND, FAIL, MISSING_EDITOR, SUCCESS } from './constants';
import { Parser } from './Parser';

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
      const snippet = new Parser(this.getText(editor)).parse();
      await vscode.env.clipboard.writeText(snippet);
      this.showInfo(SUCCESS);
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

  private showInfo(message: string): void {
    vscode.window.showInformationMessage(message);
  }

  private showError(message: string): void {
    vscode.window.showErrorMessage(message);
  }
}

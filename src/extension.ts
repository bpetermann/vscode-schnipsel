import * as vscode from 'vscode';
import { COMMAND } from './constants';

export class Service {
  constructor(private context: vscode.ExtensionContext) {}

  init() {
    const command = vscode.commands.registerCommand(COMMAND, this.copy, this);
    this.context.subscriptions.push(command);
  }

  async copy() {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      this.showError('No active editor');
      return;
    }

    const codeToCopy = editor.document.getText();

    try {
      await vscode.env.clipboard.writeText(codeToCopy);
      vscode.window.showInformationMessage('Code copied to clipboard.');
    } catch {
      this.showError('Failed to copy code to clipboard.');
    }
  }

  private showError(message: string) {
    vscode.window.showErrorMessage(message);
  }
}

export function activate(context: vscode.ExtensionContext) {
  new Service(context).init();
}

export function deactivate() {}

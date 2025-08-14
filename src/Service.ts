import path from 'path';
import * as vscode from 'vscode';
import {
  COMMAND,
  EXTENSION,
  MESSAGES,
  OPEN_SNIPPETS,
  PLACEHOLDER,
  SUPPORTED_LANGUAGES,
} from './constants';
import { Config, Language, ParserFactory, SnippetFactory } from './types';

/**
 * The main service class for the VS Code extension.
 * Manages commands, user interactions, and orchestrates snippet generation.
 */
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
      const snippetContent = this.generateSnippet(editor);
      await vscode.env.clipboard.writeText(snippetContent);
      this.showInfo();
    } catch (e) {
      console.error(MESSAGES.ERROR, e);
      this.showError(MESSAGES.FAIL);
    }
  }

  private generateSnippet(editor: vscode.TextEditor): string {
    const [language, name] = this.getMeta(editor);
    const config = this.getConfig();

    const { body } = this.parseFactory(
      this.getEditorContent(editor),
      config,
      language
    );
    const snippet = this.snippetFactory(body, language, name);
    return snippet.toString();
  }

  private getConfig(): Config {
    const config = vscode.workspace.getConfiguration(EXTENSION);
    return { placeholder: config.get<boolean>(PLACEHOLDER, true) };
  }

  private getEditorContent(editor: vscode.TextEditor): string {
    const { selection, document } = editor;

    return document.getText(
      ...(selection && !selection.isEmpty ? [selection] : [])
    );
  }

  private getMeta({ document }: vscode.TextEditor): [Language, string] {
    const language = document.languageId as Language;
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
    return SUPPORTED_LANGUAGES.includes(editor.document.languageId as Language);
  }

  private showError(message: string): void {
    vscode.window.showErrorMessage(message);
  }
}

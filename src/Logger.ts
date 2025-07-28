import * as vscode from 'vscode';

export class Logger {
  private static output = vscode.window.createOutputChannel('Schnipsel');

  public static show(text: string, label = 'Text') {
    this.output.appendLine(`${label}:`);
    Logger.output.appendLine(text);
    Logger.output.appendLine('');
    Logger.output.show(true);
  }
}

import * as vscode from 'vscode';

export class Logger {
  private static output = vscode.window.createOutputChannel('Schnipsel');

  public static show(text: string, label = 'Text') {
    this.output.clear();
    this.output.appendLine(`${label}:`);
    this.output.appendLine(text);
    this.output.show(true);
  }
}

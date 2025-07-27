import * as vscode from 'vscode';
import { Service } from './Service';

export function activate(context: vscode.ExtensionContext) {
  new Service(context).init();
}

export function deactivate() {}

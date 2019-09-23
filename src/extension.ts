'use strict';

import * as vscode from 'vscode';
import { Formatter } from "./formatter";
import { Inserter } from "./inserter";

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.addComment', () => {

        let languageId = "";

        if (vscode.window.activeTextEditor !== undefined && vscode.window.activeTextEditor.document !== undefined) {
            languageId = vscode.window.activeTextEditor.document.languageId;
        }

        const formatter = new Formatter(languageId);
        const inserter = new Inserter(languageId);

        formatter.createComment()
            .then((result) => {
                return inserter.insertInTextEditor(result);
            })
            .then((position) => {
                inserter.moveCursor(position);
            });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}

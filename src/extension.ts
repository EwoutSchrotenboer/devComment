'use strict';

import * as vscode from 'vscode';
import { Formatter } from "./formatter";
import { Inserter } from "./inserter";

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.addComment', () => {

        // todo: add keybinds
        let languageId = "";

        if (vscode.window.activeTextEditor !== undefined && vscode.window.activeTextEditor.document !== undefined) {
            languageId = vscode.window.activeTextEditor.document.languageId;
        }

        const formatter = new Formatter(languageId);
        const inserter = new Inserter(languageId);

        formatter.CreateComment()
            .then((result) => {
                return inserter.InsertInTextEditor(result);
            })
            .then((position) => {
                inserter.MoveCursor(position);
            });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}

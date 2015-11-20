/**
 * Provides the 'Goto last edit location' command.
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

let lastLocation = {
	file: '', // empty if not changed anything yet
	line: 0,
	character: 0
};

function revealLastEditLocation(editor: vscode.TextEditor): void {
	editor.selection = new vscode.Selection(lastLocation.line, lastLocation.character, lastLocation.line, lastLocation.character);
	editor.revealRange(new vscode.Range(lastLocation.line, lastLocation.character, lastLocation.line, lastLocation.character));
}

export function activate(context: vscode.ExtensionContext) {

	const documentChangeListener = vscode.workspace.onDidChangeTextDocument(e => {
		const change = e.contentChanges[e.contentChanges.length - 1];
		if (!change) {
			return;
		}

		const start = change.range.start;
		lastLocation.file = e.document.fileName;
		lastLocation.line = start.line;
		lastLocation.character = start.character + change.text.length;
	});

	const command = vscode.commands.registerCommand('extension.gotoLastEditLocation', () => {
		if (!lastLocation.file) {
			return;
		}
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor && activeEditor.document.fileName === lastLocation.file) {
			revealLastEditLocation(activeEditor);
		} else {
			vscode.workspace.openTextDocument(lastLocation.file)
				.then(vscode.window.showTextDocument)
				.then(revealLastEditLocation)
			;
		}
	});
	
	context.subscriptions.push(documentChangeListener, command);
}

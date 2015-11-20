/**
 * Provides the 'Goto last edit location' command.
 */

import * as vscode from 'vscode';

interface LastEditLocation {
	file: string;
	pos: {
		line: number;
		character: number;
	}
}

let lastEditLocation: LastEditLocation = null;

function revealLastEditLocation(editor: vscode.TextEditor): void {
	const pos = lastEditLocation.pos;
	editor.revealRange(new vscode.Range(pos.line, pos.character, pos.line, pos.character));
}

export function activate(context: vscode.ExtensionContext) {

	const documentChangeListener = vscode.workspace.onDidChangeTextDocument(e => {
		const change = e.contentChanges[e.contentChanges.length - 1];
		if (!change) {
			return;
		}

		const start = change.range.start;
		lastEditLocation = { 
			file: e.document.fileName, 
			pos: { line: start.line, character: start.character }
		};
	});

	const command = vscode.commands.registerCommand('extension.gotoLastEditLocation', () => {
		if (!lastEditLocation) {
			return;
		}
		vscode.workspace.openTextDocument(lastEditLocation.file)
			.then(vscode.window.showTextDocument)
			.then(revealLastEditLocation)
		;
	});

	context.subscriptions.push(documentChangeListener, command);
}

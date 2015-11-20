// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

interface LastEditLocation {
	file: string;
	pos: {
		line: number;
		character: number;
	}
}


let lastEditLocation: LastEditLocation = null;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const documentChangeListener = vscode.workspace.onDidChangeTextDocument(e => {
		const change = e.contentChanges[e.contentChanges.length - 1];
		if (!change) {
			return;
		}

		const start = change.range.start;
		lastEditLocation = { file: e.document.fileName, pos: { line: start.line, character: start.character } };
	});

	const command = vscode.commands.registerCommand('extension.gotoLastEditLocation', () => {
		if (!lastEditLocation) {
			return;
		}
		vscode.workspace.openTextDocument(lastEditLocation.file).then(doc => {
			vscode.window.showTextDocument(doc).then(ed => {
				const pos = lastEditLocation.pos;
				ed.revealRange(new vscode.Range(pos.line, pos.character, pos.line, pos.character));
			});
		});
	});

	context.subscriptions.push(documentChangeListener, command);
}

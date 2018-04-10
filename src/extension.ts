/**
 * Provides the 'Goto last edit location' command.
 */

import * as vscode from 'vscode';

let locationHistory = [];
let historyIndex = 0;

function history(index) {
	if (index < 0 || index >= locationHistory.length) {
		return null;
	}

	return locationHistory[index];
}

function currentEdit() {
	return history(historyIndex);
}

function moveEditHistoryBackward() {
	const lastEdit = history(historyIndex - 1);

	if (lastEdit) {
		historyIndex--;
		return lastEdit;
	}
}

function moveEditHistoryForward() {
	const nextEdit = history(historyIndex + 1);

	if (nextEdit) {
		historyIndex++;
		return nextEdit;
	}
}

function updateEditCharacter(character) {
	locationHistory[historyIndex].character = character;
}

function newEdit(file, line, character) {
	if (historyIndex < locationHistory.length - 1) {
		locationHistory = locationHistory.splice(0, historyIndex + 1);
	}

	const edit = currentEdit();

	if (edit && edit.file === file && edit.line === line) {
		updateEditCharacter(character);
	} else {
		locationHistory.push({
			file: file,
			line: line,
			character: character
		});
		historyIndex = locationHistory.length - 1;
	}
}

function revealLastEditLocation(editor: vscode.TextEditor): void {
	const edit = currentEdit();

	if (!edit) {
		return;
	}

	editor.selection = new vscode.Selection(edit.line, edit.character, edit.line, edit.character);
	editor.revealRange(new vscode.Range(edit.line, edit.character, edit.line, edit.character));
}

export function activate(context: vscode.ExtensionContext) {

	const documentChangeListener = vscode.workspace.onDidChangeTextDocument(e => {
		const change = e.contentChanges[e.contentChanges.length - 1];
		if (!change) {
			return;
		}

		const start = change.range.start;
		const file = e.document.fileName;
		const line = start.line;
		const character = start.character + change.text.length;

		if (change.text !== " " && change.text !== "\n") {
			newEdit(file, line, character);
		}
	});

	const previousEditCommand = vscode.commands.registerCommand('extension.moveCursorToPreviousEdit', () => {
		const edit = moveEditHistoryBackward();

		if (!edit) {
			return;
		}

		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor && activeEditor.document.fileName === edit.file) {
			revealLastEditLocation(activeEditor);
		} else {
			vscode.workspace.openTextDocument(edit.file)
				.then(vscode.window.showTextDocument)
				.then(revealLastEditLocation)
				;
		}
	});

	const nextEditCommand = vscode.commands.registerCommand('extension.moveCursorToNextEdit', () => {
		const edit = moveEditHistoryForward();

		if (!edit) {
			return;
		}

		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor && activeEditor.document.fileName === edit.file) {
			revealLastEditLocation(activeEditor);
		} else {
			vscode.workspace.openTextDocument(edit.file)
				.then(vscode.window.showTextDocument)
				.then(revealLastEditLocation)
				;
		}
	});

	context.subscriptions.push(documentChangeListener, previousEditCommand, nextEditCommand);
}

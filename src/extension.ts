/**
 * Provides the 'Goto previous/next edit location' command.
 */

import * as vscode from 'vscode';

interface ILocation {
	file: string;
	line: number;
	character: number;
}

let locationHistory = <ILocation[]>[];
const maxLocationsDefault = 1000;
let currentIndex = maxLocationsDefault - 1;

function getPreviousLocation() {
	currentIndex = Math.max(Math.min(currentIndex, locationHistory.length - 1) - 1, 0);
	return locationHistory[currentIndex];
}

function getNextLocation() {
	currentIndex = Math.min(currentIndex + 1, locationHistory.length - 1);
	return locationHistory[currentIndex];
}

function revealEditLocation(location: ILocation): void {
	if (!location) {
		return;
	}

	function _revealEditLocation(editor: vscode.TextEditor) {
		editor.selection = new vscode.Selection(location.line, location.character, location.line, location.character);
		editor.revealRange(new vscode.Range(location.line, location.character, location.line, location.character));
	}

	let activeEditor = vscode.window.activeTextEditor;
	if (activeEditor && activeEditor.document.fileName === location.file) {
		_revealEditLocation(activeEditor);
	} else {
		vscode.workspace.openTextDocument(location.file)
			.then(vscode.window.showTextDocument)
			.then(_revealEditLocation)
		;
	}
}

export function activate(context: vscode.ExtensionContext) {

	const documentChangeListener = vscode.workspace.onDidChangeTextDocument(e => {
		const change = e.contentChanges[e.contentChanges.length - 1];
		if (!change) {
			return;
		}

		const start = change.range.start;
		const lastLocation = locationHistory[locationHistory.length - 1];
		const character = start.character + change.text.length;
		if (!lastLocation || lastLocation.file !== e.document.fileName || lastLocation.line !== start.line) {
				locationHistory.push({
					file: e.document.fileName,
					line: start.line,
					character: character,
				});
		} else {
			lastLocation.character = character;
		}
		let maxLocations = Math.max(vscode.workspace.getConfiguration('gotoLastEditLocation').get('maxLocations', maxLocationsDefault), 2);
		if (isNaN(maxLocations)) {
			maxLocations = maxLocationsDefault;
		}
		if (locationHistory.length > maxLocations) {
			locationHistory = locationHistory.slice(locationHistory.length - maxLocations);
		}
	});

	const commandPrevious = vscode.commands.registerCommand('extension.gotoPreviousEditLocation', () => {
		revealEditLocation(getPreviousLocation());
	});

	const commandNext = vscode.commands.registerCommand('extension.gotoNextEditLocation', () => {
		revealEditLocation(getNextLocation());
	});

	const commandClear = vscode.commands.registerCommand('extension.clearLocationHistory', () => {
		locationHistory = [];
	});

	context.subscriptions.push(documentChangeListener, commandPrevious, commandNext);
}

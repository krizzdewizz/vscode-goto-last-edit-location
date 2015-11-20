/**
 * Provides the 'Goto last edit location' command.
 */
var vscode = require('vscode');
var lastLocation = {
    file: '',
    line: 0,
    character: 0
};
function revealLastEditLocation(editor) {
    editor.selection = new vscode.Selection(lastLocation.line, lastLocation.character, lastLocation.line, lastLocation.character);
    editor.revealRange(new vscode.Range(lastLocation.line, lastLocation.character, lastLocation.line, lastLocation.character));
}
function activate(context) {
    var documentChangeListener = vscode.workspace.onDidChangeTextDocument(function (e) {
        var change = e.contentChanges[e.contentChanges.length - 1];
        if (!change) {
            return;
        }
        var start = change.range.start;
        lastLocation.file = e.document.fileName;
        lastLocation.line = start.line;
        lastLocation.character = start.character + change.text.length;
    });
    var command = vscode.commands.registerCommand('extension.gotoLastEditLocation', function () {
        if (!lastLocation.file) {
            return;
        }
        var activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && activeEditor.document.fileName === lastLocation.file) {
            revealLastEditLocation(activeEditor);
        }
        else {
            vscode.workspace.openTextDocument(lastLocation.file)
                .then(vscode.window.showTextDocument)
                .then(revealLastEditLocation);
        }
    });
    context.subscriptions.push(documentChangeListener, command);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map
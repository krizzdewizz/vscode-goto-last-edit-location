/**
 * Provides the 'Goto last edit location' command.
 */
var vscode = require('vscode');
var lastEditLocation = null;
function revealLastEditLocation(editor) {
    var pos = lastEditLocation.pos;
    editor.revealRange(new vscode.Range(pos.line, pos.character, pos.line, pos.character));
}
function activate(context) {
    var documentChangeListener = vscode.workspace.onDidChangeTextDocument(function (e) {
        var change = e.contentChanges[e.contentChanges.length - 1];
        if (!change) {
            return;
        }
        var start = change.range.start;
        lastEditLocation = {
            file: e.document.fileName,
            pos: { line: start.line, character: start.character }
        };
    });
    var command = vscode.commands.registerCommand('extension.gotoLastEditLocation', function () {
        if (!lastEditLocation) {
            return;
        }
        vscode.workspace.openTextDocument(lastEditLocation.file)
            .then(vscode.window.showTextDocument)
            .then(revealLastEditLocation);
    });
    context.subscriptions.push(documentChangeListener, command);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map
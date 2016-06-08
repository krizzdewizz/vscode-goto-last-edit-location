# vscode-goto-last-edit-location
Visual Studio Code extension that provides the "Goto last edit location" command.

After installing and pressing `F1`, you should see the 'Goto last edit location' command in the drop down:

![Command](doc/command.png "Goto last edit location command")

Press `CTRL+Q` to invoke the command.

## Release Info
v0.2.0
- Changed keybinding to `CTRL+Q` on Mac ([Pull Request](https://github.com/krizzdewizz/vscode-goto-last-edit-location/pull/1))
- Changed keybinding to be always active.

v0.1.0
- Initial release

## Development setup
- run `npm install` inside the project folder
- open VS Code on the project folder

## Build
- run `npm run compile`.

## Package
- run `vsce package`.


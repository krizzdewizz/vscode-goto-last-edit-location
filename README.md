# vscode-goto-last-edit-location
Visual Studio Code extension that provides the "Goto last edit location" command.

## Installation
Copy the folder `dist/goto-last-edit-location` folder to your VS Code extension folder:

- Windows: `%USERPROFILE%\.vscode\extensions`
- Mac/Linux: `$HOME/.vscode/extensions`

By pressing `F1` you should now see 'Goto last edit location' command in the drop down.

## Assign a shortcut
Insert this into your `keybindings.json`:
```
{
    "key": "ctrl+q",
    "command": "extension.gotoLastEditLocation"
}
```
## Development setup
- run `npm install` inside the project folder
- open VS Code on the project folder

## Build
- run `npm run compile`.
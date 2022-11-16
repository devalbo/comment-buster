// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CommentBusterPanel } from './commentBusterPanel';
import { CLangs_LanguageConfiguration, PythonLanguageConfiguration, TypeScriptLanguageConfiguration } from './LanguageConfigurations';



let _commentBusterPanel: CommentBusterPanel | undefined;
let _bustemCommandTypeScript: vscode.Disposable;
let _bustemCommandPython: vscode.Disposable;
let _bustemCommandCLangs: vscode.Disposable;


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "comment-buster" is now active!');
  console.log ("Activating extension");

  const initPanel = (): CommentBusterPanel => {
    if (!_commentBusterPanel) {
      const commentBusterPanel = new CommentBusterPanel(context);
      _commentBusterPanel = commentBusterPanel;
      vscode.window.showInformationMessage('Creating CommentBusterPanel');
    }

    const config = vscode.workspace.getConfiguration('comment-buster').get('directories');
    // const config = vscode.workspace.getConfiguration('commentBuster.directories');
    console.log("PLUGIN CONFIG");
    console.log(config);
    // console.log(config.get("commentBuster"));

    return _commentBusterPanel;
  };


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	_bustemCommandTypeScript = vscode.commands.registerCommand('comment-buster.bustem-typescript', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World 2 from comment-buster!');

    // if (!_commentBusterPanel) {
    //   const commentBusterPanel = new CommentBusterPanel(context);
    //   _commentBusterPanel = commentBusterPanel;
    //   vscode.window.showInformationMessage('Creating CommentBusterPanel');
    // }

    const commentBusterPanel = initPanel();
    commentBusterPanel.refreshTreeView(TypeScriptLanguageConfiguration);
	});

  _bustemCommandPython = vscode.commands.registerCommand('comment-buster.bustem-python', async () => {
		vscode.window.showInformationMessage('Refresh comment-buster for Python!');

    // if (_commentBusterPanel) {
    //   // _commentBusterPanel.bustComments();
    //   _commentBusterPanel.refreshTreeView();
    // } else {
    //   vscode.window.showInformationMessage('CommentBusterPanel is not active');
    // }

    const commentBusterPanel = initPanel();
    commentBusterPanel.refreshTreeView(PythonLanguageConfiguration);
	});

  _bustemCommandCLangs = vscode.commands.registerCommand('comment-buster.bustem-clangs', async () => {
		vscode.window.showInformationMessage('Refresh comment-buster for C/C++!');

    const commentBusterPanel = initPanel();
    commentBusterPanel.refreshTreeView(CLangs_LanguageConfiguration);
	});

	context.subscriptions.push(_bustemCommandTypeScript);
  context.subscriptions.push(_bustemCommandPython);
  context.subscriptions.push(_bustemCommandCLangs);  

  console.log("Activation complete");
}

// This method is called when your extension is deactivated
export function deactivate() {
  vscode.window.showInformationMessage('Deactivating comment buster plugin');

  _bustemCommandTypeScript.dispose();
  _bustemCommandPython.dispose();
  _bustemCommandCLangs.dispose();
  
  _commentBusterPanel = undefined;
}

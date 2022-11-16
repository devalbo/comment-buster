// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CommentBusterPanel } from './commentBuster/commentBusterPanel';
import { PrintStatementBusterPanel } from './printStatementBuster/printStatementBusterPanel';
import { cLangsLanguageConfiguration, pythonLanguageConfiguration, typeScriptLanguageConfiguration } from './LanguageConfigurations';



let _commentBusterPanel: CommentBusterPanel | undefined;
let _bustemCommandTypeScript: vscode.Disposable;
let _bustemCommandPython: vscode.Disposable;
let _bustemCommandCLangs: vscode.Disposable;


const activateCommentBusterPanel = (context: vscode.ExtensionContext) => {
  
  const initCommentBusterPanel = (): CommentBusterPanel => {
    if (!_commentBusterPanel) {
      const commentBusterPanel = new CommentBusterPanel(context);
      _commentBusterPanel = commentBusterPanel;
      vscode.window.showInformationMessage('Creating CommentBusterPanel');
    }

    return _commentBusterPanel;
  };

  // The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	_bustemCommandTypeScript = vscode.commands.registerCommand('comment-buster.bust-comments-typescript', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World 2 from comment-buster!');

    const commentBusterPanel = initCommentBusterPanel();
    commentBusterPanel.refreshTreeView(typeScriptLanguageConfiguration);
	});

  _bustemCommandPython = vscode.commands.registerCommand('comment-buster.bust-comments-python', async () => {
		vscode.window.showInformationMessage('Refresh comment-buster for Python!');

    const commentBusterPanel = initCommentBusterPanel();
    commentBusterPanel.refreshTreeView(pythonLanguageConfiguration);
	});

  _bustemCommandCLangs = vscode.commands.registerCommand('comment-buster.bust-comments-clangs', async () => {
		vscode.window.showInformationMessage('Refresh comment-buster for C/C++!');

    const commentBusterPanel = initCommentBusterPanel();
    commentBusterPanel.refreshTreeView(cLangsLanguageConfiguration);
	});

	context.subscriptions.push(_bustemCommandTypeScript);
  context.subscriptions.push(_bustemCommandPython);
  context.subscriptions.push(_bustemCommandCLangs);  
};

const deactivateCommentBusterPanel = () => {
  _bustemCommandTypeScript.dispose();
  _bustemCommandPython.dispose();
  _bustemCommandCLangs.dispose();
  
  _commentBusterPanel = undefined;
};



let _printStatementBusterPanel: PrintStatementBusterPanel | undefined;
let _bustPrintStatementsCommandTypeScript: vscode.Disposable;
let _bustPrintStatementsCommandPython: vscode.Disposable;
let _bustPrintStatementsCommandCLangs: vscode.Disposable;

const activatePrintStatementBusterPanel = (context: vscode.ExtensionContext) => {
  
  const initPrintStatementBusterPanel = (): PrintStatementBusterPanel => {
    if (!_printStatementBusterPanel) {
      const printStatementBusterPanel = new PrintStatementBusterPanel(context);
      _printStatementBusterPanel = printStatementBusterPanel;
      vscode.window.showInformationMessage('Creating PrintStatementBusterPanel');
    }

    return _printStatementBusterPanel;
  };

	_bustPrintStatementsCommandTypeScript = vscode.commands.registerCommand('comment-buster.bust-printstatements-typescript', async () => {
    const printStatementBusterPanel = initPrintStatementBusterPanel();
    printStatementBusterPanel.refreshTreeView(typeScriptLanguageConfiguration);
	});

  _bustPrintStatementsCommandPython = vscode.commands.registerCommand('comment-buster.bust-printstatements-python', async () => {
    const printStatementBusterPanel = initPrintStatementBusterPanel();
    printStatementBusterPanel.refreshTreeView(pythonLanguageConfiguration);
	});

  _bustPrintStatementsCommandCLangs = vscode.commands.registerCommand('comment-buster.bust-printstatements-clangs', async () => {
    const printStatementBusterPanel = initPrintStatementBusterPanel();
    printStatementBusterPanel.refreshTreeView(cLangsLanguageConfiguration);
	});

	context.subscriptions.push(_bustPrintStatementsCommandTypeScript);
  context.subscriptions.push(_bustPrintStatementsCommandPython);
  context.subscriptions.push(_bustPrintStatementsCommandCLangs);  
};

const deactivatePrintStatementBusterPanel = () => {
  _bustPrintStatementsCommandTypeScript.dispose();
  _bustPrintStatementsCommandPython.dispose();
  _bustPrintStatementsCommandCLangs.dispose();
  
  _printStatementBusterPanel = undefined;
};


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "comment-buster" is now active!');

  activateCommentBusterPanel(context);
  activatePrintStatementBusterPanel(context);

  console.log("Activation complete");
}

// This method is called when your extension is deactivated
export function deactivate() {
  vscode.window.showInformationMessage('Deactivating comment buster plugin');

  deactivateCommentBusterPanel();
  deactivatePrintStatementBusterPanel();
}

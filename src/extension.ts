// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CommentSectionsFinder } from './CommentSectionsFinder';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "comment-buster" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('comment-buster.helloWorld', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World 2 from comment-buster!');

    const commentSectionsFinder = new CommentSectionsFinder();
    const commentSectionResults = await commentSectionsFinder.findCommentSections("ts", "ts");
    commentSectionResults.forEach(csr => {
      console.log(csr);
    })

    // // vscode.window.
    // vscode.workspace.workspaceFolders?.forEach(async f => {
    //   console.log(f.name);
    //   const tsFiles = await vscode.workspace.findFiles('**/*.ts', '**/node_modules/**');
    //   tsFiles.forEach(async tsFile => {
    //     // console.log(tsFile.path);
    //     const tsContent = await vscode.workspace.openTextDocument(tsFile);
    //     const lineCount = tsContent.lineCount;
    //     console.log(tsFile.path + "  [" + lineCount + "]");
    //   });

    //   // const wsDir = await vscode.workspace.fs.readDirectory(f.uri);
    //   // wsDir.forEach(element => {
    //   //   console.log(element);
    //   // });
    // })



    // //initialize
		// const editor = vscode.window.activeTextEditor!
		// let cursorPosition = editor.selection.start

		// //getting function block
		// let wordRange = editor.document.getWordRangeAtPosition(cursorPosition)
		// let functionName = editor.document.getText(wordRange)

		// var wordLine = editor.document.lineAt(cursorPosition)
		// var textRange = new vscode.Range(wordLine.range.start, wordLine.range.end)
		// var wholeText = editor.document.getText(textRange)

		// var lineCount = cursorPosition.line

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

import * as vscode from 'vscode';
import { PsbTreeNode, PrintStatementBusterTreeDataProvider } from './printStatementBusterTreeDataProvider';
import { ILanguageConfiguration } from '../LanguageConfigurations';


export class PrintStatementBusterPanel {

  readonly _treeView: vscode.TreeView<PsbTreeNode>;
  readonly _treeDataProvider: PrintStatementBusterTreeDataProvider;

	constructor(context: vscode.ExtensionContext) {
    console.log("Creating Print Statement Buster Panel");

    this._treeDataProvider = new PrintStatementBusterTreeDataProvider();
    
		const view = vscode.window.createTreeView('printStatementBusterPanel', 
      { treeDataProvider: this._treeDataProvider, showCollapseAll: false });
		context.subscriptions.push(view);

    this._treeView = view;

    console.log(view);
	}

  refreshTreeView = async (languageConfiguration: ILanguageConfiguration) => {
    console.log("REFRESH PRINT STATEMENT BUSTER PANEL TREE VIEW");

    this._treeDataProvider.refresh(languageConfiguration);
  };
}

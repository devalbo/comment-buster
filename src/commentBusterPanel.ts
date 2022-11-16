import * as vscode from 'vscode';
import { CbTreeNode, CommentBusterTreeDataProvider } from './commentBusterTreeDataProvider';
import { ILanguageConfiguration } from './LanguageConfigurations';


export class CommentBusterPanel {

  readonly _treeView: vscode.TreeView<CbTreeNode>;
  readonly _treeDataProvider: CommentBusterTreeDataProvider;

	constructor(context: vscode.ExtensionContext) {
    console.log("Creating Comment Buster Panel");

    this._treeDataProvider = new CommentBusterTreeDataProvider();
    
		const view = vscode.window.createTreeView('commentBusterPanel', 
      { treeDataProvider: this._treeDataProvider, showCollapseAll: false });
		context.subscriptions.push(view);

    this._treeView = view;

    console.log(view);
	}

  refreshTreeView = async (languageConfiguration: ILanguageConfiguration) => {
    console.log("REFRESH COMMENT BUSTER PANEL TREE VIEW");

    this._treeDataProvider.refresh(languageConfiguration);
  };
}

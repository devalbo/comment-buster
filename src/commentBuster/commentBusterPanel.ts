import * as vscode from 'vscode';
import { CbTreeNode, CommentBusterTreeDataProvider } from './commentBusterTreeDataProvider';
import { ILanguageConfiguration } from '../LanguageConfigurations';


export class CommentBusterPanel {

  readonly _treeView: vscode.TreeView<CbTreeNode>;
  readonly _treeDataProvider: CommentBusterTreeDataProvider;

	constructor(context: vscode.ExtensionContext) {
    this._treeDataProvider = new CommentBusterTreeDataProvider();
    
		const view = vscode.window.createTreeView('commentBusterPanel', 
      { treeDataProvider: this._treeDataProvider, showCollapseAll: false });
		context.subscriptions.push(view);

    this._treeView = view;
	}

  refreshTreeView = async (languageConfiguration: ILanguageConfiguration) => {
    this._treeDataProvider.refresh(languageConfiguration);
  };
}

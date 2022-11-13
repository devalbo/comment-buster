import * as vscode from 'vscode';
import { commentBusterTreeDataProvider } from './commentBusterTreeDataProvider';
import { Dependency, RealCommentBusterTreeDataProvider } from './RealCommentBusterTreeDataProvider';


export class CommentBusterPanel {

  readonly _treeView: vscode.TreeView<{key: string}>;
  // readonly _treeDataProvider: vscode.TreeDataProvider<{key: string}>;
  // readonly _treeView: vscode.TreeView<Dependency>;
  readonly _treeDataProvider: RealCommentBusterTreeDataProvider;

	constructor(context: vscode.ExtensionContext) {
    console.log("Creating Comment Buster Panel");

    this._treeDataProvider = new RealCommentBusterTreeDataProvider('.');
    
		const view = vscode.window.createTreeView('commentBusterPanel', 
      { treeDataProvider: this._treeDataProvider, showCollapseAll: false });
		context.subscriptions.push(view);

    this._treeView = view;
    
    
    
		// vscode.commands.registerCommand('commentBusterPanel.reveal', async () => {
		// 	const key = await vscode.window.showInputBox({ placeHolder: 'Type the label of the panel item to reveal' });
		// 	if (key) {
		// 		await view.reveal({ key }, { focus: true, select: false, expand: true });
		// 	}
		// });
		// vscode.commands.registerCommand('commentBusterPanel.changeTitle', async () => {
		// 	const title = await vscode.window.showInputBox({ prompt: 'Type the new title for the Test View Panel', placeHolder: view.title });
		// 	if (title) {
		// 		view.title = title;
		// 	}
		// });

    console.log(view);
	}

  blah = () => {
    console.log("BLAH FROM COMMENT BUSTER PANEL");
  };

  refreshTreeView = async () => {
    console.log("REFRESH COMMENT BUSTER PANEL TREE VIEW");

    this._treeDataProvider.refresh();

    // this._treeview.

    // this._onDidChangeTreeData.fire();
    // this._treeDataProvider.onDidChangeTreeData!;

  };

  // private _onDidChangeTreeData: vscode.EventEmitter<{key: string} | undefined | null | void> = new vscode.EventEmitter<{key: string} | undefined | null | void>();
  // readonly onDidChangeTreeData: vscode.Event<{key: string} | undefined | null | void> = this._onDidChangeTreeData.event;

  // private _onDidChangeTreeData: vscode.EventEmitter<string | undefined | null | void> = new vscode.EventEmitter<string | undefined | null | void>();
}

// const tree: any = {
//   'other': {
//     'child': {}
//   },
// 	'a': {
// 		'aa': {
// 			'aaa': {
// 				'aaaa': {
// 					'aaaaa': {
// 						'aaaaaa': {

// 						}
// 					}
// 				}
// 			}
// 		},
// 		'ab': {}
// 	},
// 	'b': {
// 		'ba': {},
// 		'bb': {}
// 	},
//   'c': {
//     'comment': {}
//   }
// };
// const nodes: any = {};

// function aNodeWithIdTreeDataProvider(): vscode.TreeDataProvider<{ key: string }> {
//   console.log('aNodeWithIdTreeDataProvider');
// 	return {
// 		getChildren: (element: { key: string }): { key: string }[] => {
// 			return getChildren(element ? element.key : undefined).map(key => getNode(key));
// 		},
// 		getTreeItem: (element: { key: string }): vscode.TreeItem => {
// 			const treeItem = getTreeItem(element.key);
// 			treeItem.id = element.key;
// 			return treeItem;
// 		},
// 		getParent: ({ key }: { key: string }): { key: string } | undefined => {
// 			const parentKey = key.substring(0, key.length - 1);
// 			return parentKey ? new Key(parentKey) : undefined;
// 		}
// 	};
// }

// function getChildren(key: string | undefined): string[] {
// 	if (!key) {
// 		return Object.keys(tree);
// 	}
// 	const treeElement = getTreeElement(key);
// 	if (treeElement) {
// 		return Object.keys(treeElement);
// 	}
//   console.log("no children for " + key);
// 	return [];
// }

// function getTreeItem(key: string): vscode.TreeItem {
// 	const treeElement = getTreeElement(key);
//   console.log("getTreeItem - " + key);
// 	// An example of how to use codicons in a MarkdownString in a tree item tooltip.
// 	const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${key}`, true);
// 	return {
// 		label: /**vscode.TreeItemLabel**/<any>{ label: key + "--", highlights: key.length > 1 ? [[key.length - 2, key.length - 1]] : void 0 },
// 		tooltip,
// 		collapsibleState: treeElement && Object.keys(treeElement).length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
// 	};
// }

// function getTreeElement(element: string): any {
// 	let parent = tree;
// 	for (let i = 0; i < element.length; i++) {
// 		parent = parent[element.substring(0, i + 1)];
// 		if (!parent) {
//       console.log("no parent for " + element);
// 			return null;
// 		}
// 	}
// 	return parent;
// }

// function getNode(key: string): { key: string } {
// 	if (!nodes[key]) {
// 		nodes[key] = new Key(key);
// 	}
// 	return nodes[key];
// }

// class Key {
// 	constructor(readonly key: string) { }
// }
import * as vscode from 'vscode';
import { Key } from './commentBusterTreeDataProvider';


const tree2: any = {
  'other': {
    'child': {}
  },
	'a': {
		'aa': {
			'aaa': {
				'aaaa': {
					'aaaaa': {
						'aaaaaa': {

						}
					}
				}
			}
		},
		'ab': {}
	},
	'b': {
		'ba': {},
		'bb': {}
	},
  'c': {
    'comment': {}
  }
};
const nodes2: any = {};


export function aNodeWithIdTreeDataProvider2 (): vscode.TreeDataProvider<{ key: string }> {
  console.log('aNodeWithIdTreeDataProvider');
	return {
		getChildren: (element: { key: string }): { key: string }[] => {
			return getChildren2(element ? element.key : undefined).map(key => getNode(key));
		},
		getTreeItem: (element: { key: string }): vscode.TreeItem => {
			const treeItem = getTreeItem2(element.key);
			treeItem.id = element.key;
			return treeItem;
		},
		getParent: ({ key }: { key: string }): { key: string } | undefined => {
			const parentKey = key.substring(0, key.length - 1);
			return parentKey ? new Key(parentKey) : undefined;
		}
	};
}

function getChildren2(key: string | undefined): string[] {
	if (!key) {
		return Object.keys(tree2);
	}
	const treeElement = getTreeElement(key);
	if (treeElement) {
		return Object.keys(treeElement);
	}
  console.log("no children for " + key);
	return [];
}

function getTreeItem2(key: string): vscode.TreeItem {
	const treeElement = getTreeElement(key);
  console.log("getTreeItem - " + key);
	// An example of how to use codicons in a MarkdownString in a tree item tooltip.
	const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${key}`, true);
	return {
		label: /**vscode.TreeItemLabel**/<any>{ label: key + "--", highlights: key.length > 1 ? [[key.length - 2, key.length - 1]] : void 0 },
		tooltip,
		collapsibleState: treeElement && Object.keys(treeElement).length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
	};
}

function getTreeElement(element: string): any {
	let parent = tree2;
	for (let i = 0; i < element.length; i++) {
		parent = parent[element.substring(0, i + 1)];
		if (!parent) {
      console.log("no parent for " + element);
			return null;
		}
	}
	return parent;
}

function getNode(key: string): { key: string } {
	if (!nodes2[key]) {
		nodes2[key] = new Key(key);
	}
	return nodes2[key];
}

// class Key {
// 	constructor(readonly key: string) { }
// }
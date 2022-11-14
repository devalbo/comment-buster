// RealCommentBusterTreeDataProvider

import * as vscode from 'vscode';
import { CommentSectionsFinder } from './CommentSectionsFinder';
import { ILanguageConfiguration, TypeScriptLanguageConfiguration } from './LanguageConfigurations';
// import * as fs from 'fs';
// import * as path from 'path';
// import { Key } from './commentBusterTreeDataProviderOld';
import { ICommentSection, ICommentSectionFinderResult, WorkspaceCommentSectionsFinder } from './WorkspaceCommentSectionsFinder';




// export interface ICommentSection {
//   startLineNumber: number
//   endLineNumber: number
// }


// export interface ICommentSectionFinderResult {
//   fileUri: vscode.Uri
//   totalLineCount: number
//   commentSections: ICommentSection[]
// }



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
//     'commentx': {}
//   }
// };
// const nodes: any = {};


type CbTreeFileResult = {
  cbDataType: 'fileResult'
  resultData: ICommentSectionFinderResult
  children: CbCommenSection[]
};

type CbCommenSection = {
  cbDataType: 'commentSection'
  commentSection: ICommentSection
  parent: CbTreeFileResult
};

export type CbTreeNode = CbTreeFileResult | CbCommenSection;

// export class RealCommentBusterTreeDataProvider implements vscode.TreeDataProvider<Dependency> {
export class CommentBusterTreeDataProvider implements vscode.TreeDataProvider<CbTreeNode> {
  // constructor(private workspaceRoot: string) {}

  // private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | null | void> = new vscode.EventEmitter<Dependency | undefined | null | void>();
  // readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | null | void> = this._onDidChangeTreeData.event;

  private _onDidChangeTreeData: vscode.EventEmitter<CbTreeNode | undefined | null | void> = new vscode.EventEmitter<CbTreeNode | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<CbTreeNode | undefined | null | void> = this._onDidChangeTreeData.event;

  sourceData: CbTreeNode[] = [];


  refresh = async (languageConfiguration: ILanguageConfiguration) => {

    const commentSectionsFinder = new WorkspaceCommentSectionsFinder();
    // const commentSectionResults = await commentSectionsFinder.findCommentSections("ts", "ts");
    const commentSectionResults = await commentSectionsFinder.findCommentSections(languageConfiguration);
    const commentSectionData = commentSectionResults
      .filter(r => r.commentSections.length > 0)
      .map(r => {
        const sections = r.commentSections.map(s => {
          return {
            cbDataType: 'commentSection',
            commentSection: s,
            // parent: 
          } as CbCommenSection;
        });

        const sourceDatum = {
          cbDataType: 'fileResult',
          resultData: r,
          children: sections,
        } as CbTreeFileResult;

        sourceDatum.children.forEach(c => {
          c.parent = sourceDatum;
        });

        return sourceDatum;
      });

    commentSectionResults.forEach(csr => {
      // console.log(csr);
    });

    // console.log("SETTING COMMENT SECTION DATA");
    // console.log(commentSectionData);

    this.sourceData = commentSectionData;



    // console.log("FIRING FROM REFRESH");
    // tree['c'] = {
    //   'commentxxx': {}
    // };

    this._onDidChangeTreeData.fire();
  };


  getFileResultTreeItem = (item: CbTreeFileResult): vscode.TreeItem => {
    const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${item.resultData.fileUri.toString()}`, true);

    const fileLocation = item.resultData.fileUri;

    const command = {
			command: 'vscode.open',
			title: 'Open Call',
			arguments: [
				// item.uri,
        fileLocation,
				// <vscode.TextDocumentShowOptions>{
				// 	selection: element.item.selectionRange.with({ end: element.item.selectionRange.start }),
				// 	preserveFocus: true
				// }
			]
		};

    return {
      label: /**vscode.TreeItemLabel**/<any>{ 
        label: item.resultData.fileUri.toString(), 
        // highlights: key.length > 1 ? [[key.length - 2, key.length - 1]] : void 0 
      },
      tooltip,
      // collapsibleState: treeElement && Object.keys(treeElement).length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
      collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
    };

  };

  getCommentSectionTreeItem = (item: CbCommenSection): vscode.TreeItem => {
    const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${item.commentSection.startLineNumber}`, true);

    const fileLocation = item.parent.resultData.fileUri;

    // const range = {
    //   start: {
    //     line: item.commentSection.startLineNumber - 1,
    //   },
    //   end: {
    //     line: item.commentSection.endLineNumber,
    //   }
    // } as vscode.Range;

    const range2 = new vscode.Range(item.commentSection.startLineNumber - 1, 0, item.commentSection.endLineNumber, 0);

    const command = {
			command: 'vscode.open',
      // command: 'vscode.window.showTextDocument',
			title: 'Open Call',
			arguments: [
				// item.uri,
        fileLocation,
        <vscode.TextDocumentShowOptions> {
				// <vscode.TextDocumentShowOptions> {
        // <vscode.TextDocumentOpenOptions>
					// selection: element.item.selectionRange.with({ end: element.item.selectionRange.start }),
          selection: range2,
					// preserveFocus: true,
          // selection: 
				}
			]
		} as vscode.Command;

    return {
      label: /**vscode.TreeItemLabel**/<any>{ 
        label: `Lines ${item.commentSection.startLineNumber} - ${item.commentSection.endLineNumber}`,
        // highlights: key.length > 1 ? [[key.length - 2, key.length - 1]] : void 0 
      },
      tooltip,
      // collapsibleState: treeElement && Object.keys(treeElement).length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
      collapsibleState: vscode.TreeItemCollapsibleState.None,
      command,
    };

  };


  getTreeItem(element: CbTreeNode): vscode.TreeItem {
    switch (element.cbDataType) {
      case 'commentSection':
        return this.getCommentSectionTreeItem(element);
      case 'fileResult':
        return this.getFileResultTreeItem(element);
    }

    // const treeItem = this.rcGetTreeItem(element.key);
    // treeItem.id = element.key;
    // return treeItem;
  }

  // getParent({ key }: { key: string }): { key: string } | undefined {
  //   const parentKey = key.substring(0, key.length - 1);
  //   return parentKey ? new Key(parentKey) : undefined;
  // }
  getParent = (item: CbTreeNode): CbTreeNode | undefined => {
    if (item.cbDataType === 'fileResult') {
      return undefined;
    }

    return item.parent;

    // const parentKey = key.substring(0, key.length - 1);
    // return parentKey ? new Key(parentKey) : undefined;
  };

  getChildren(element?: CbTreeNode | undefined): vscode.ProviderResult<CbTreeNode[]> {
    if (!element) {
      return this.sourceData;
    }

    if (element.cbDataType === 'fileResult') {
      return element.children;
    }

    return undefined;

    // throw new Error('Method not implemented.');

    // let a: HoverProvider = {
    //   provideHover(doc, pos, token): vscode.ProviderResult<{ key: string; }[]> {
    //       return new Hover('Hello World');
    //   }
    // }

    // const children = this.rcGetChildren(element?.key);

    // const retval = children.map(c => ({
    //   key: c,
    // }));

    // // const retval = [
    // //   {
    // //     key: children[0],
    // //   }
    // // ];

    // return retval;

    // return new vscode.ProviderResult<{ key: string; }[]> {
    //   return [
    //     {key: ""}
    //   ];
    //   // return new Hover('Hello World');
    // }
  }


  // // getChildren(key: string | undefined): string[] {
  // getChildren(element?: { key: string; } | undefined): vscode.ProviderResult<{ key: string; }[]> {
  //   // throw new Error('getChildren() - Method not implemented.');
  //   const children = this.rcGetChildren(element?.key);
    
  //   const pr: vscode.ProviderResult<{ key: string; }[]> {
  //     return new Promise(resolve => {
  //       // resolve(new Hover('Hello World'));
  //      });
  //   };

  //   return pr;

  //   // const retval = {
  //   //   key: children
  //   // };

  //   // return new vscode.ProviderResult<{ key: string; }[]>(retval);
  //   // return retval;
  // }

  // resolveTreeItem?(item: vscode.TreeItem, element: { key: string; }, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
  //   throw new Error('resolveTreeItem() - Method not implemented.');
  // }



  // rcGetTreeItem(key: string): vscode.TreeItem {
  //   const treeElement = this.rcGetTreeElement(key);
  //   console.log("getTreeItem - " + key);
  //   // An example of how to use codicons in a MarkdownString in a tree item tooltip.
  //   const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${key}`, true);
  //   return {
  //     label: /**vscode.TreeItemLabel**/<any>{ label: key + "--", highlights: key.length > 1 ? [[key.length - 2, key.length - 1]] : void 0 },
  //     tooltip,
  //     collapsibleState: treeElement && Object.keys(treeElement).length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
  //   };
  // }

  // rcGetTreeElement(element: string): any {
  //   let parent = tree;
  //   for (let i = 0; i < element.length; i++) {
  //     parent = parent[element.substring(0, i + 1)];
  //     if (!parent) {
  //       console.log("no parent for " + element);
  //       return null;
  //     }
  //   }
  //   return parent;
  // }

  // rcGetChildren(key: string | undefined): string[] {
  //   if (!key) {
  //     return Object.keys(tree);
  //   }
  //   const treeElement = this.rcGetTreeElement(key);
  //   if (treeElement) {
  //     return Object.keys(treeElement);
  //   }
  //   console.log("no children for " + key);
  //   return [];
  // }


  // getTreeItem(element: Dependency): vscode.TreeItem {
  //   console.log("RCBTD: getTreeItem");
  //   console.log(element);
  //   return element;
  // }

  // getChildren(element?: Dependency): Thenable<Dependency[]> {
  //   console.log("RCBTD: getChildren");
  //   console.log(element);

  //   if (!this.workspaceRoot) {
  //     vscode.window.showInformationMessage('No dependency in empty workspace');
  //     return Promise.resolve([]);
  //   }

  //   if (element) {
  //     return Promise.resolve(
  //       this.getDepsInPackageJson(
  //         path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')
  //       )
  //     );
  //   } else {
  //     const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
  //     if (this.pathExists(packageJsonPath)) {
  //       return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
  //     } else {
  //       vscode.window.showInformationMessage('Workspace has no package.json');
  //       return Promise.resolve([]);
  //     }
  //   }
  // }

//   /**
//    * Given the path to package.json, read all its dependencies and devDependencies.
//    */
//   private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
//     if (this.pathExists(packageJsonPath)) {
//       const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

//       const toDep = (moduleName: string, version: string): Dependency => {
//         if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
//           return new Dependency(
//             moduleName,
//             version,
//             vscode.TreeItemCollapsibleState.Collapsed
//           );
//         } else {
//           return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None);
//         }
//       };

//       const deps = packageJson.dependencies
//         ? Object.keys(packageJson.dependencies).map(dep =>
//             toDep(dep, packageJson.dependencies[dep])
//           )
//         : [];
//       const devDeps = packageJson.devDependencies
//         ? Object.keys(packageJson.devDependencies).map(dep =>
//             toDep(dep, packageJson.devDependencies[dep])
//           )
//         : [];
//       return deps.concat(devDeps);
//     } else {
//       return [];
//     }
//   }

//   private pathExists(p: string): boolean {
//     try {
//       fs.accessSync(p);
//     } catch (err) {
//       return false;
//     }
//     return true;
//   }
// }

// export class Dependency extends vscode.TreeItem {
//   constructor(
//     public readonly label: string,
//     private version: string,
//     public readonly collapsibleState: vscode.TreeItemCollapsibleState
//   ) {
//     super(label, collapsibleState);
//     this.tooltip = `${this.label}-${this.version}`;
//     this.description = this.version;
//   }

//   iconPath = {
//     light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
//     dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
//   };
}
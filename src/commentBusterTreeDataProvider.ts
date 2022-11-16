import * as vscode from 'vscode';
import { ILanguageConfiguration } from './LanguageConfigurations';
import { ICommentSection, ICommentSectionFinderResult, WorkspaceCommentSectionsFinder } from './WorkspaceCommentSectionsFinder';


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


export class CommentBusterTreeDataProvider implements vscode.TreeDataProvider<CbTreeNode> {

  private _onDidChangeTreeData: vscode.EventEmitter<CbTreeNode | undefined | null | void> = new vscode.EventEmitter<CbTreeNode | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<CbTreeNode | undefined | null | void> = this._onDidChangeTreeData.event;

  sourceData: CbTreeNode[] = [];


  refresh = async (languageConfiguration: ILanguageConfiguration) => {

    const commentSectionsFinder = new WorkspaceCommentSectionsFinder();
    const commentSectionResults = await commentSectionsFinder.findCommentSections(languageConfiguration);

    const commentSectionData = commentSectionResults
      .filter(r => r.commentSections.length > 0)
      .map(r => {
        const sections = r.commentSections.map(s => {
          return {
            cbDataType: 'commentSection',
            commentSection: s,
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

    this.sourceData = commentSectionData;

    this._onDidChangeTreeData.fire();
  };


  getFileResultTreeItem = (item: CbTreeFileResult): vscode.TreeItem => {
    const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${item.resultData.fileUri.toString()}`, true);

    return {
      label: /**vscode.TreeItemLabel**/<any>{ 
        label: item.resultData.fileUri.toString(), 
      },
      tooltip,
      collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
    };

  };

  getCommentSectionTreeItem = (item: CbCommenSection): vscode.TreeItem => {
    const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${item.commentSection.startLineNumber}`, true);

    const fileLocation = item.parent.resultData.fileUri;

    const commentRange = new vscode.Range(item.commentSection.startLineNumber - 1, 0, item.commentSection.endLineNumber, 0);

    const command = {
			command: 'vscode.open',
			title: 'Open Call',
			arguments: [
        fileLocation,
        <vscode.TextDocumentShowOptions> {
          selection: commentRange,
				}
			]
		} as vscode.Command;

    return {
      label: /**vscode.TreeItemLabel**/<any>{ 
        label: `Lines ${item.commentSection.startLineNumber} - ${item.commentSection.endLineNumber}`,
      },
      tooltip,
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
  }

  getParent = (item: CbTreeNode): CbTreeNode | undefined => {
    if (item.cbDataType === 'fileResult') {
      return undefined;
    }

    return item.parent;
  };

  getChildren(element?: CbTreeNode | undefined): vscode.ProviderResult<CbTreeNode[]> {
    if (!element) {
      return this.sourceData;
    }

    if (element.cbDataType === 'fileResult') {
      return element.children;
    }

    return undefined;
  }
}

import * as vscode from 'vscode';
import { ILanguageConfiguration } from '../LanguageConfigurations';
import { ICommentSection, ICommentSectionFinderResult, WorkspaceCommentSectionsFinder } from '../WorkspaceCommentSectionsFinder';


type PsbTreeFileResult = {
  cbDataType: 'fileResult'
  resultData: ICommentSectionFinderResult
  children: PsbCommenSection[]
};


type PsbCommenSection = {
  cbDataType: 'commentSection'
  commentSection: ICommentSection
  parent: PsbTreeFileResult
};


export type PsbTreeNode = PsbTreeFileResult | PsbCommenSection;


export class PrintStatementBusterTreeDataProvider implements vscode.TreeDataProvider<PsbTreeNode> {

  private _onDidChangeTreeData: vscode.EventEmitter<PsbTreeNode | undefined | null | void> = new vscode.EventEmitter<PsbTreeNode | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<PsbTreeNode | undefined | null | void> = this._onDidChangeTreeData.event;

  sourceData: PsbTreeNode[] = [];


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
          } as PsbCommenSection;
        });

        const sourceDatum = {
          cbDataType: 'fileResult',
          resultData: r,
          children: sections,
        } as PsbTreeFileResult;

        sourceDatum.children.forEach(c => {
          c.parent = sourceDatum;
        });

        return sourceDatum;
      });

    this.sourceData = commentSectionData;

    this._onDidChangeTreeData.fire();
  };


  getFileResultTreeItem = (item: PsbTreeFileResult): vscode.TreeItem => {
    const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${item.resultData.fileUri.toString()}`, true);

    return {
      label: /**vscode.TreeItemLabel**/<any>{ 
        label: item.resultData.fileUri.toString(), 
      },
      tooltip,
      collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
    };

  };

  getCommentSectionTreeItem = (item: PsbCommenSection): vscode.TreeItem => {
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


  getTreeItem(element: PsbTreeNode): vscode.TreeItem {
    switch (element.cbDataType) {
      case 'commentSection':
        return this.getCommentSectionTreeItem(element);
      case 'fileResult':
        return this.getFileResultTreeItem(element);
    }
  }

  getParent = (item: PsbTreeNode): PsbTreeNode | undefined => {
    if (item.cbDataType === 'fileResult') {
      return undefined;
    }

    return item.parent;
  };

  getChildren(element?: PsbTreeNode | undefined): vscode.ProviderResult<PsbTreeNode[]> {
    if (!element) {
      return this.sourceData;
    }

    if (element.cbDataType === 'fileResult') {
      return element.children;
    }

    return undefined;
  }
}

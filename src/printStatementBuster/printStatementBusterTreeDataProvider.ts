import * as vscode from 'vscode';
import { ILanguageConfiguration } from '../LanguageConfigurations';
import { IPrintStatementSection, IPrintStatementSectionFinderResult } from '../printStatementBusterInterfaces';
import { WorkspaceSectionsFinder } from '../WorkspaceSectionsFinder';


type PsbTreeFileResult = {
  psbDataType: 'fileResult'
  resultData: IPrintStatementSectionFinderResult
  children: PsbCommenSection[]
};


type PsbCommenSection = {
  psbDataType: 'printStatementSection'
  printStatementSection: IPrintStatementSection
  parent: PsbTreeFileResult
};


export type PsbTreeNode = PsbTreeFileResult | PsbCommenSection;


export class PrintStatementBusterTreeDataProvider implements vscode.TreeDataProvider<PsbTreeNode> {

  private _onDidChangeTreeData: vscode.EventEmitter<PsbTreeNode | undefined | null | void> = new vscode.EventEmitter<PsbTreeNode | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<PsbTreeNode | undefined | null | void> = this._onDidChangeTreeData.event;

  sourceData: PsbTreeNode[] = [];


  refresh = async (languageConfiguration: ILanguageConfiguration) => {

    const printStatementSectionsFinder = new WorkspaceSectionsFinder();
    const printStatementSectionResults = await printStatementSectionsFinder.findPrintStatementSections(languageConfiguration);

    const printStatementSectionData = printStatementSectionResults
      .filter(r => r.printStatementSections.length > 0)
      .map(r => {
        const sections = r.printStatementSections.map(s => {
          return {
            psbDataType: 'printStatementSection',
            printStatementSection: s,
          } as PsbCommenSection;
        });

        const sourceDatum = {
          psbDataType: 'fileResult',
          resultData: r,
          children: sections,
        } as PsbTreeFileResult;

        sourceDatum.children.forEach(c => {
          c.parent = sourceDatum;
        });

        return sourceDatum;
      });

    this.sourceData = printStatementSectionData;

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
    const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${item.printStatementSection.startLineNumber}`, true);

    const fileLocation = item.parent.resultData.fileUri;

    const commentRange = new vscode.Range(item.printStatementSection.startLineNumber - 1, 0, item.printStatementSection.endLineNumber, 0);

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

    const label = item.printStatementSection.startLineNumber === item.printStatementSection.endLineNumber ? 
      `Line ${item.printStatementSection.startLineNumber}` :
      `Lines ${item.printStatementSection.startLineNumber} - ${item.printStatementSection.endLineNumber}`;

    return {
      label: /**vscode.TreeItemLabel**/<any>{ 
        label,
      },
      tooltip,
      collapsibleState: vscode.TreeItemCollapsibleState.None,
      command,
    };

  };


  getTreeItem(element: PsbTreeNode): vscode.TreeItem {
    switch (element.psbDataType) {
      case 'printStatementSection':
        return this.getCommentSectionTreeItem(element);
      case 'fileResult':
        return this.getFileResultTreeItem(element);
    }
  }

  getParent = (item: PsbTreeNode): PsbTreeNode | undefined => {
    if (item.psbDataType === 'fileResult') {
      return undefined;
    }

    return item.parent;
  };

  getChildren(element?: PsbTreeNode | undefined): vscode.ProviderResult<PsbTreeNode[]> {
    if (!element) {
      return this.sourceData;
    }

    if (element.psbDataType === 'fileResult') {
      return element.children;
    }

    return undefined;
  }
}

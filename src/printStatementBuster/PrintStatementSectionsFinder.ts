import * as vscode from 'vscode';
import { IPrintStatementSectionFinderResult, IPrintStatementSectionFinderResultForProgrammingLanguage } from '../printStatementBusterInterfaces';
import { findMatchingRegexSectionsForLines } from '../regexMatchBuster/RegexesForLinesMatcher';
const _ = require('lodash');



export class PrintStatementSectionsFinder implements IPrintStatementSectionFinderResultForProgrammingLanguage {
 
  findPrintStatementSections = async (fileUris: vscode.Uri[], printStatementLineRegexes: string[]): Promise<IPrintStatementSectionFinderResult[]> => {
   
    const allResultTasks = fileUris.map(async x => 
      this.createPrintStatementSectionFinderResultForFile(x, printStatementLineRegexes));

    const allResults = await Promise.all(allResultTasks);

    return allResults;
  };


  createPrintStatementSectionFinderResultForFile = async (fileUri: vscode.Uri, printStatementLineRegexes: string[]): Promise<IPrintStatementSectionFinderResult> => {

    try {
      const tsContent = await vscode.workspace.openTextDocument(fileUri);

      const lines = _
        .range(tsContent.lineCount)
        .map((x: number) => tsContent.lineAt(x).text as string) as string[];

      const regexMatchLinesSections = findMatchingRegexSectionsForLines(lines, printStatementLineRegexes);

      return {
        fileUri,
        totalLineCount: lines.length,
        printStatementSections: regexMatchLinesSections,
      };
      
    } catch (e) {
      console.error(e);
      return {
        fileUri,
        totalLineCount: 0,
        printStatementSections: [],
      };
    }
  };
}

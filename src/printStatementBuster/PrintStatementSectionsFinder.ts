import * as vscode from 'vscode';
import { IPrintStatementSectionFinderResult, IPrintStatementSectionFinderResultForProgrammingLanguage } from '../printStatementBusterInterfaces';
import { findMatchingRegexSectionsForLines } from '../regexMatchBuster/RegexesForLinesMatcher';
const _ = require('lodash');



// type PsbLineClassifications = 
//   'e' |  // empty/blank line
//   'p' |  // print statement line
//   'x';   // code

export class PrintStatementSectionsFinder implements IPrintStatementSectionFinderResultForProgrammingLanguage {
 
  findPrintStatementSections = async (fileUris: vscode.Uri[], printStatementLineRegexes: string[]): Promise<IPrintStatementSectionFinderResult[]> => {
    console.log("FINDING TS PRINT STATEMENT SECTIONS");
    
    const allResultTasks = fileUris.map(async x => 
      this.createPrintStatementSectionFinderResultForFile(x, printStatementLineRegexes));
    
    console.log("SECTION 1");
    console.log(allResultTasks);

    const allResults = await Promise.all(allResultTasks);

    console.log("SECTION 2");

    // const resultsWithCommentSections = allResults.filter(this.hasCommentSectionFilter);

    console.log("DONE WQITH PRINT STATEMENT FINDER RESULTS");
    return allResults;
  };


  createPrintStatementSectionFinderResultForFile = async (fileUri: vscode.Uri, printStatementLineRegexes: string[]): Promise<IPrintStatementSectionFinderResult> => {

    try {
      const tsContent = await vscode.workspace.openTextDocument(fileUri);
      if (!tsContent) {
        console.log("NO CONTENT - " + fileUri.toString());
      }

      const lines = _
        .range(tsContent.lineCount)
        .map((x: number) => tsContent.lineAt(x).text as string) as string[];

      // return this.createPrintStatementSectionFinderResultForLines(fileUri, tsLines, printStatementLineRegexes);
      // const lineCount = lines.length;
      // const printStatementSections = this.findPrintStatementSectionsForLines(lines, commentLineStarterCharacters);
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

  
  // createPrintStatementSectionFinderResultForLines = async (fileUri: vscode.Uri, lines: string[], printStatementLineRegexes: string[]): Promise<IPrintStatementSectionFinderResult> => {

  //   try {
  //     const lineCount = lines.length;
  //     // const printStatementSections = this.findPrintStatementSectionsForLines(lines, commentLineStarterCharacters);
  //     const regexMatchLinesSections = findMatchingRegexSectionsForLines(lines, printStatementLineRegexes);
  
  //     return {
  //       fileUri,
  //       totalLineCount: lineCount,
  //       printStatementSections: regexMatchLinesSections,
  //     };
  //   } catch (e) {
  //     return {
  //       fileUri,
  //       totalLineCount: 0,
  //       printStatementSections: [],
  //     };
  //   }
  // };

  // classifyLine = (currentLine: string, commentLineStarterCharacters: string[]): PsbLineClassifications => {
  //   const text = currentLine.trim();
    
  //   for (let i=0; i < commentLineStarterCharacters.length; i++) {
  //     const commentLineStarter = commentLineStarterCharacters[i];
  //     if (text.startsWith(commentLineStarter)) {
  //       return 'c';
  //     }
  //   }

  //   if (text.length === 0) {
  //     return 'e';
  //   }

  //   return 'x';
  // };


  // findPrintStatementSectionsForLines = (lines: string[], commentLineStarterCharacters: string[]): IPrintStatementSection[] => {
    
  //   const commentSections: IPrintStatementSection[] = [];

  //   const lineClassifications = lines.map(l => this.classifyLine(l, commentLineStarterCharacters));
  //   const lineClassificationsNotation = lineClassifications.join('');

  //   const regex = /(c+((e|c)*)c+)/gm;

  //   const allMatches = lineClassificationsNotation.matchAll(regex);
  //   let next = allMatches.next();

  //   while (!next.done) {
  //     const lineNumber = next.value.index! + 1;
  //     const sectionLength = next.value[0].length;

  //     const commentSection = {
  //       startLineNumber: lineNumber,
  //       endLineNumber: lineNumber + sectionLength - 1,
  //     } as IPrintStatementSection;

  //     commentSections.push(commentSection);
  //     next = allMatches.next();
  //   }

  //   return commentSections;
  // };


  // hasCommentSectionFilter = (commentSectionFinderResult: IPrintStatementSectionFinderResult): boolean => {
  //   // const toKeep = commentSectionFinderResult.totalLineCount >= 100;
  //   // return toKeep;
  //   return true;
  // };
}

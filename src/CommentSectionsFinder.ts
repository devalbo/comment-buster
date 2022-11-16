import * as vscode from 'vscode';
// import _ from 'lodash';
const _ = require('lodash');
import { ICommentSection, ICommentSectionFinderResult, ICommentSectionFinderResultForProgrammingLanguage } from './WorkspaceCommentSectionsFinder';


type LineClassifications = 
  'e' |  // empty/blank line
  'c' |  // comment
  'x';   // code

export class CommentSectionsFinder implements ICommentSectionFinderResultForProgrammingLanguage {
 
  findCommentSections = async (fileUris: vscode.Uri[], commentLineStarterCharacters: string[]): Promise<ICommentSectionFinderResult[]> => {
    console.log("FINDING TS COMMENT SECTIONS");
    
    const allResultTasks = fileUris.map(async x => 
      this.createCommentSectionFinderResultForFile(x, commentLineStarterCharacters));
    
    console.log("SECTION 1");
    console.log(allResultTasks);

    const allResults = await Promise.all(allResultTasks);

    console.log("SECTION 2");

    const resultsWithCommentSections = allResults.filter(this.hasCommentSectionFilter);

    console.log("DONE WQITH RESULTS");
    return resultsWithCommentSections;
  };

  createCommentSectionFinderResultForFile = async (fileUri: vscode.Uri, commentLineStarterCharacters: string[]): Promise<ICommentSectionFinderResult> => {

    try {
      const tsContent = await vscode.workspace.openTextDocument(fileUri);
      if (!tsContent) {
        console.log("NO CONTENT - " + fileUri.toString());
      }

      const tsLines = _
        .range(tsContent.lineCount)
        .map((x: number) => tsContent.lineAt(x).text as string) as string[];

      return this.createCommentSectionFinderResultForLines(fileUri, tsLines, commentLineStarterCharacters);
  
    } catch (e) {
      return {
        fileUri,
        totalLineCount: 0,
        commentSections: [],
      };
    }

  };

  
  createCommentSectionFinderResultForLines = async (fileUri: vscode.Uri, lines: string[], commentLineStarterCharacters: string[]): Promise<ICommentSectionFinderResult> => {

    try {
      const lineCount = lines.length;
      const commentSections = this.findCommentSectionsForLines(lines, commentLineStarterCharacters);
  
      return {
        fileUri,
        totalLineCount: lineCount,
        commentSections
      };
    } catch (e) {
      return {
        fileUri,
        totalLineCount: 0,
        commentSections: [],
      };
    }

  };

  classifyLine = (currentLine: string, commentLineStarterCharacters: string[]): LineClassifications => {
    const text = currentLine.trim();
    
    for (let i=0; i < commentLineStarterCharacters.length; i++) {
      const commentLineStarter = commentLineStarterCharacters[i];
      if (text.startsWith(commentLineStarter)) {
        return 'c';
      }
    }

    if (text.length === 0) {
      return 'e';
    }

    return 'x';
  };


  findCommentSectionsForLines = (lines: string[], commentLineStarterCharacters: string[]): ICommentSection[] => {
    
    const commentSections: ICommentSection[] = [];

    const lineClassifications = lines.map(l => this.classifyLine(l, commentLineStarterCharacters));
    const lineClassificationsNotation = lineClassifications.join('');

    const regex = /(c+((e|c)*)c+)/gm;

    const allMatches = lineClassificationsNotation.matchAll(regex);
    let next = allMatches.next();

    while (!next.done) {
      const lineNumber = next.value.index! + 1;
      const sectionLength = next.value[0].length;

      const commentSection = {
        startLineNumber: lineNumber,
        endLineNumber: lineNumber + sectionLength - 1,
      } as ICommentSection;

      commentSections.push(commentSection);
      next = allMatches.next();
    }

    return commentSections;
  };


  hasCommentSectionFilter = (commentSectionFinderResult: ICommentSectionFinderResult): boolean => {
    const toKeep = commentSectionFinderResult.totalLineCount >= 100;
    return toKeep;
  };
}

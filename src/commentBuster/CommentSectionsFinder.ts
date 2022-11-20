import * as vscode from 'vscode';
import { ICommentSection, ICommentSectionFinderResult, ICommentSectionFinderResultForProgrammingLanguage } from '../commentBusterInterfaces';
const _ = require('lodash');



type LineClassifications = 
  'e' |  // empty/blank line
  'c' |  // comment
  'x';   // code

export class CommentSectionsFinder implements ICommentSectionFinderResultForProgrammingLanguage {
 
  findCommentSections = async (fileUris: vscode.Uri[], commentLineStarterCharacters: string[]): Promise<ICommentSectionFinderResult[]> => {
    const allResultTasks = fileUris.map(async x => 
      this.createCommentSectionFinderResultForFile(x, commentLineStarterCharacters));

    const allResults = await Promise.all(allResultTasks);

    return allResults;
  };

  createCommentSectionFinderResultForFile = async (fileUri: vscode.Uri, commentLineStarterCharacters: string[]): Promise<ICommentSectionFinderResult> => {

    try {
      const tsContent = await vscode.workspace.openTextDocument(fileUri);

      const tsLines = _
        .range(tsContent.lineCount)
        .map((x: number) => tsContent.lineAt(x).text as string) as string[];

      return this.createCommentSectionFinderResultForLines(fileUri, tsLines, commentLineStarterCharacters);
  
    } catch (e) {
      return {
        fileUri,
        fileLines: [],
        // totalLineCount: 0,
        commentSections: [],
      };
    }

  };

  
  createCommentSectionFinderResultForLines = async (fileUri: vscode.Uri, lines: string[], commentLineStarterCharacters: string[]): Promise<ICommentSectionFinderResult> => {

    try {
      // const lineCount = lines.length;
      const commentSections = this.findCommentSectionsForLines(lines, commentLineStarterCharacters);
  
      return {
        fileUri,
        fileLines: lines,
        // totalLineCount: lineCount,
        commentSections
      };
    } catch (e) {
      return {
        fileUri,
        fileLines: lines,
        // totalLineCount: 0,
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
}

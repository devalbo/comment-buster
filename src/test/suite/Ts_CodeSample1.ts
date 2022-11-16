export const Ts_CodeSample1 = `

import * as vscode from 'vscode';
// import _ from 'lodash';
const _ = require('lodash');
import { ICommentSection, ICommentSectionFinderResult, ICommentSectionFinderResult_ProgrammingLanguage } from './CommentSectionsFinder';


type LineClassifications = 
  ' ' |  // empty
  'x' |  // code
  '#';   // comment

export class CommentSectionsFinder_TypeScript implements ICommentSectionFinderResult_ProgrammingLanguage {
 
  findCommentSections = async (fileUris: vscode.Uri[]): Promise<ICommentSectionFinderResult[]> => {
    console.log("FINDING TS COMMENT SECTIONS");
    
    const allResultTasks = fileUris.map(async x => 
      this.createCommentSectionFinderResultForFile(x));
    
    const allResults = await Promise.all(allResultTasks);

    const resultsWithCommentSections = allResults.filter(this.hasCommentSectionFilter);

    return resultsWithCommentSections;

    // fileUris.forEach(async fileUri => {
    //   // console.log(tsFile.path);
    //   const tsContent = await vscode.workspace.openTextDocument(lFile);
    //   const lineCount = tsContent.lineCount;
    //   console.log(fileUri.path + "  [" + lineCount + "]");
    // });

    // throw new Error("Method not implemented.");
    // throw new Error("Method not implemented.");
  }

  createCommentSectionFinderResultForFile = async (fileUri: vscode.Uri): Promise<ICommentSectionFinderResult> => {
    const tsContent = await vscode.workspace.openTextDocument(fileUri);
    const lineCount = tsContent.lineCount;

    const tsLines = _.range(lineCount).map((x: number) => tsContent.lineAt(x).text);
    
    const commentSections = this.findTypeScriptCommentSections(tsLines);

    return {
      fileUri,
      totalLineCount: lineCount,
      commentSections
    };
  }


  classifyLine = (currentLine: string): LineClassifications => {
    const text = currentLine.trim();
    
    if (text.startsWith('//')) {
      return '#';
    }

    if (text.length === 0) {
      return ' ';
    }

    return 'x';
  }


  findTypeScriptCommentSections = (tsLines: string[]): ICommentSection[] => {
    
    const lineClassifications = [];
    const commentSections: ICommentSection[] = [];

    let commentSectionStartLine: number = 1;
    let inCommentSection = false;

    for (let i = 0; i < tsLines.length; i++) {
      const currentLine = tsLines[i];
      const lineClassification = this.classifyLine(currentLine);

      const currentLineNumber = i + 1;

      switch (lineClassification) {
        case '#': {
          if (!inCommentSection) {
            inCommentSection = true;
            commentSectionStartLine = currentLineNumber;
          }
        }
        case ' ': {

        }
        case 'x': {
          if (inCommentSection) {
            const numLinesToBeCommentSection = 2;
            if (currentLineNumber >= commentSectionStartLine + numLinesToBeCommentSection) {
              commentSections.push({
                startLineNumber: commentSectionStartLine,
                endLineNumber: currentLineNumber,
              });
            }
          }
          inCommentSection = false;
        }
      }

      // const x = 'abc' + lineClassification;

      lineClassifications.push(lineClassification);
    }

    return commentSections;
  }


  hasCommentSectionFilter = (commentSectionFinderResult: ICommentSectionFinderResult): boolean => {
    const toKeep = commentSectionFinderResult.totalLineCount >= 100;
    if (!toKeep) {
      // console.log("REJECTING " + commentSectionFinderResult.totalLineCount);
    }

    return toKeep;
  }

}
`;
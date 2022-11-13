import * as vscode from 'vscode';
// import _ from 'lodash';
const _ = require('lodash');
import { ICommentSection, ICommentSectionFinderResult, ICommentSectionFinderResultForProgrammingLanguage } from './CommentSectionsFinder';


type LineClassifications = 
  ' ' |  // empty
  'x' |  // code
  '#';   // comment

export class CommentSectionsFinderForTypeScript implements ICommentSectionFinderResultForProgrammingLanguage {
 
  findCommentSections = async (fileUris: vscode.Uri[]): Promise<ICommentSectionFinderResult[]> => {
    console.log("FINDING TS COMMENT SECTIONS");
    
    const allResultTasks = fileUris.map(async x => 
      this.createCommentSectionFinderResultForFile(x));
    
    console.log("SECTION 1");
    console.log(allResultTasks);

    const allResults = await Promise.all(allResultTasks);

    console.log("SECTION 2");

    const resultsWithCommentSections = allResults.filter(this.hasCommentSectionFilter);

    console.log("DONE WQITH RESULTS");
    return resultsWithCommentSections;

    // fileUris.forEach(async fileUri => {
    //   // console.log(tsFile.path);
    //   const tsContent = await vscode.workspace.openTextDocument(lFile);
    //   const lineCount = tsContent.lineCount;
    //   console.log(fileUri.path + "  [" + lineCount + "]");
    // });

    // throw new Error("Method not implemented.");
    // throw new Error("Method not implemented.");
  };

  createCommentSectionFinderResultForFile = async (fileUri: vscode.Uri): Promise<ICommentSectionFinderResult> => {

    try {
      const tsContent = await vscode.workspace.openTextDocument(fileUri);
      if (!tsContent) {
        console.log("NO CONTENT - " + fileUri.toString());
      }
      const tsLines = _
        .range(tsContent.lineCount)
        .map((x: number) => tsContent.lineAt(x).text);
  
      const lineCount = tsContent.lineCount;
      
      // console.log(fileUri.fsPath);
      const commentSections = this.findTypeScriptCommentSections(tsLines);
  
      return {
        fileUri,
        totalLineCount: lineCount,
        commentSections
      };
    } catch (e) {
      // console.log("ERR: createCommentSectionFinderResultForFile");
      // console.log(fileUri.toString());
      // console.log(e);
      return {
        fileUri,
        totalLineCount: 0,
        commentSections: [],
      };
    }

  };


  classifyLine = (currentLine: string): LineClassifications => {
    const text = currentLine.trim();
    
    if (text.startsWith('//')) {
      return '#';
    }

    if (text.length === 0) {
      return ' ';
    }

    return 'x';
  };


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
        case '#':
          if (!inCommentSection) {
            inCommentSection = true;
            commentSectionStartLine = currentLineNumber;
            // console.log("COMMENTS SECTION START: " + commentSectionStartLine);
          }
          break;
        case ' ': 
          break;
        case 'x':
          if (inCommentSection) {
            const numLinesToBeCommentSection = 2;
            if (currentLineNumber >= commentSectionStartLine + numLinesToBeCommentSection) {
              commentSections.push({
                startLineNumber: commentSectionStartLine,
                endLineNumber: currentLineNumber - 1,
              });
            }
          }
          inCommentSection = false;
          break;
      }

      // const x = 'abc' + lineClassification;

      lineClassifications.push(lineClassification);
    }

    return commentSections;
  };


  hasCommentSectionFilter = (commentSectionFinderResult: ICommentSectionFinderResult): boolean => {
    const toKeep = commentSectionFinderResult.totalLineCount >= 100;
    if (!toKeep) {
      // console.log("REJECTING " + commentSectionFinderResult.totalLineCount);
    }

    return toKeep;
  };

}
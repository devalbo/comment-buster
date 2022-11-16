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
      // console.log("createCommentSectionFinderResultForFile");
      // console.log(fileUri);

      const tsContent = await vscode.workspace.openTextDocument(fileUri);
      if (!tsContent) {
        console.log("NO CONTENT - " + fileUri.toString());
      }

      const tsLines = _
        .range(tsContent.lineCount)
        .map((x: number) => tsContent.lineAt(x).text as string) as string[];

      return this.createCommentSectionFinderResultForLines(fileUri, tsLines, commentLineStarterCharacters);
  
    //   const lineCount = tsContent.lineCount;
      
    //   // console.log(fileUri.fsPath);
    //   const commentSections = this.findTypeScriptCommentSections(tsLines);
  
    //   return {
    //     fileUri,
    //     totalLineCount: lineCount,
    //     commentSections
    //   };
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

  
  createCommentSectionFinderResultForLines = async (fileUri: vscode.Uri, lines: string[], commentLineStarterCharacters: string[]): Promise<ICommentSectionFinderResult> => {

    try {
    //   const tsContent = await vscode.workspace.openTextDocument(fileUri);
    //   if (!tsContent) {
    //     console.log("NO CONTENT - " + fileUri.toString());
    //   }
    //   const tsLines = _
    //     .range(tsContent.lineCount)
    //     .map((x: number) => tsContent.lineAt(x).text);
  
      const lineCount = lines.length;
      
      // console.log(fileUri.fsPath);
      // console.log("CHECKING FIEL FOR LINES");
      // console.log(fileUri);

      const commentSections = this.findCommentSectionsForLines(lines, commentLineStarterCharacters);
  
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
    
    // const lineClassifications = [];
    const commentSections: ICommentSection[] = [];

    const lineClassifications = lines.map(l => this.classifyLine(l, commentLineStarterCharacters));
    const lineClassificationsNotation = lineClassifications.join('');

    // console.log("LINE CLASSIFICATIONS NOTATION");
    // console.log(lineClassificationsNotation);

    const regex = /(c+((e|c)*)c+)/gm;

    const allMatches = lineClassificationsNotation.matchAll(regex);
    let next = allMatches.next();
    // console.log("NEXT");
    // if (!next.value) {
    //   console.log("NO VALUE");
    // }
    // console.log(">>> " + next.value);
    // console.log(".>>> " + next.value.index);
    // console.log("<< NEXT");

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

    // while ((m = regex.exec(lineClassificationsNotation)) !== null) {
    //   // This is necessary to avoid infinite loops with zero-width matches
    //   if (m.index === regex.lastIndex) {
    //       regex.lastIndex++;
    //   }
      
    //   // The result can be accessed through the `m`-variable.
    //   m.forEach((match, groupIndex) => {
    //       console.log(`Found match, group ${groupIndex}: ${match}`);
    //       if (groupIndex === 0) {
    //         retval.push({
    //           startLineNumber: m[0]
    //         })
    //       }
    //   });
    // }


    // let commentSectionStartLine: number = 1;
    // let inCommentSection = false;

    // for (let i = 0; i < lines.length; i++) {
    //   const currentLine = lines[i];
    //   const lineClassification = this.classifyLine(currentLine, commentLineStarterCharacters);

    //   const currentLineNumber = i + 1;

    //   switch (lineClassification) {
    //     case 'c':
    //       if (!inCommentSection) {
    //         inCommentSection = true;
    //         commentSectionStartLine = currentLineNumber;
    //         // console.log("COMMENTS SECTION START: " + commentSectionStartLine);
    //       }
    //       break;
    //     case 'e': 
    //       break;
    //     case 'x':
    //       if (inCommentSection) {
    //         const numLinesToBeCommentSection = 2;
    //         if (currentLineNumber >= commentSectionStartLine + numLinesToBeCommentSection) {
    //           commentSections.push({
    //             startLineNumber: commentSectionStartLine,
    //             endLineNumber: currentLineNumber - 1,
    //           });
    //         }
    //       }
    //       inCommentSection = false;
    //       break;
    //   }

    //   lineClassifications.push(lineClassification);
    // }

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
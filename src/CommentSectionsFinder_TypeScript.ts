import * as vscode from 'vscode';
import { ICommentSectionFinderResult, ICommentSectionFinderResult_ProgrammingLanguage } from './CommentSectionsFinder';


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
    // console.log(fileUri.path + "  [" + lineCount + "]");

    return {
      fileUri,
      totalLineCount: lineCount,
    };
  }


  hasCommentSectionFilter = (commentSectionFinderResult: ICommentSectionFinderResult): boolean => {
    const toKeep = commentSectionFinderResult.totalLineCount >= 100;
    if (!toKeep) {
      // console.log("REJECTING " + commentSectionFinderResult.totalLineCount);
    }

    return toKeep;
  }

}
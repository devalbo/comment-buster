import * as vscode from 'vscode';
import { CommentSectionsFinder } from "./commentBuster/CommentSectionsFinder";
import { ICommentSectionFinderResult, ICommentSectionsFinder } from './commentBusterInterfaces';
import { ILanguageConfiguration } from './LanguageConfigurations';
import { IPrintStatementSectionFinderResult, IPrintStatementSectionsFinder } from './printStatementBusterInterfaces';
import { findFileCandidates } from './utils';


// const findFileCandidates = async (globPatternToInclude: string, globPatternsToExclude: string[]): Promise<Set<vscode.Uri>> => {
//   // const globPatternToInclude = languageConfiguration.getGlobPatternToInclude();
//   // const globPatternsToExclude = languageConfiguration.getGlobPatternsToExclude();

//   const findFileTasks = globPatternsToExclude.map(async globPatternToExclude => {
//     const someFiles = await vscode.workspace.findFiles(globPatternToInclude, globPatternToExclude);
//     return new Set(someFiles);
//   });

//   const allFindFileResults = await Promise.all(findFileTasks);
//   const combinedFindFileResults = computeSetsIntersection(allFindFileResults);

//   return combinedFindFileResults;
// };


export class WorkspaceSectionsFinder implements ICommentSectionsFinder, IPrintStatementSectionsFinder {
 
  findCommentSections = async (languageConfiguration: ILanguageConfiguration): Promise<ICommentSectionFinderResult[]> => {

    const languageFiles: vscode.Uri[] = [];

    const globPatternToInclude = languageConfiguration.getGlobPatternToInclude();
    const globPatternsToExclude = languageConfiguration.getGlobPatternsToExclude();

    // const findFileTasks = globPatternsToExclude.map(async globPatternToExclude => {
    //   const someFiles = await vscode.workspace.findFiles(globPatternToInclude, globPatternToExclude);
    //   return new Set(someFiles);
    // });

    // const allFindFileResults = await Promise.all(findFileTasks);
    // const combinedFindFileResults = computeSetsIntersection(allFindFileResults);

    const combinedFindFileResults = await findFileCandidates(globPatternToInclude, globPatternsToExclude);

    combinedFindFileResults.forEach(r => {
      languageFiles.push(r);
    });

    const tsFinder = new CommentSectionsFinder();
    const commentSections = await tsFinder.findCommentSections(languageFiles, languageConfiguration.commentCharacters);
    return commentSections;
  };

  findPrintStatementSections(languageConfiguration: ILanguageConfiguration): Promise<IPrintStatementSectionFinderResult[]> {
    throw new Error('Method not implemented.');
  }
}

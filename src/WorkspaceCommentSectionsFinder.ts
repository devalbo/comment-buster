import * as vscode from 'vscode';
import { CommentSectionsFinder } from "./CommentSectionsFinder";
import { ILanguageConfiguration } from './LanguageConfigurations';



export interface ICommentSection {
  startLineNumber: number
  endLineNumber: number
}


export interface ICommentSectionFinderResult {
  fileUri: vscode.Uri
  totalLineCount: number
  commentSections: ICommentSection[]
}


export interface ICommentSectionFinderResultForProgrammingLanguage {
  findCommentSections(fileUris: vscode.Uri[], commentLineStarterCharacters: string[]): Promise<ICommentSectionFinderResult[]>
}


export interface ICommentSectionsFinder {
  findCommentSections(languageConfiguration: ILanguageConfiguration): Promise<ICommentSectionFinderResult[]>  
}


// based on https://stackoverflow.com/a/69534630
// function setsIntersection(...sets) {
const setsIntersection = (sets: Set<vscode.Uri>[]): Set<vscode.Uri> => {
  if (sets.length < 1) {
    return new Set();
  }

  let minSize = sets[0].size;
  let minSetIndex = 0;

  for (let i = 1; i < sets.length; i++) {
    const size = sets[i].size;
    if (size < minSize) {
      minSize = size;
      minSetIndex = i;
    }
  }

  const result = new Set(sets[minSetIndex]);
  for (let i = 1; i < sets.length && i !== minSetIndex; i++) {
    for (const v of result) {
      if (!sets[i].has(v)) {
        result.delete(v);
      }
    }
  }

  return result;
};


export class WorkspaceCommentSectionsFinder implements ICommentSectionsFinder {
  
  findCommentSections = async (languageConfiguration: ILanguageConfiguration): Promise<ICommentSectionFinderResult[]> => {

    const x = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path);
    const languageFiles: vscode.Uri[] = [];

    const globPatternToInclude = languageConfiguration.getGlobPatternToInclude();
    const globPatternsToExclude = languageConfiguration.getGlobPatternsToExclude();

    const findFileTasks = globPatternsToExclude.map(async globPatternToExclude => {
      const someFiles = await vscode.workspace.findFiles(globPatternToInclude, globPatternToExclude);
      return new Set(someFiles);
    });

    const allFindFileResults = await Promise.all(findFileTasks);
    const combinedFindFileResults = setsIntersection(allFindFileResults);

    combinedFindFileResults.forEach(r => {
      languageFiles.push(r);
    });

    const tsFinder = new CommentSectionsFinder();
    const commentSections = await tsFinder.findCommentSections(languageFiles, languageConfiguration.commentCharacters);
    return commentSections;
  };
}

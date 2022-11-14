import * as vscode from 'vscode';
import { SupportedProgrammingLanguages } from "./constants";
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
  // findCommentSections(languageConfiguration: ILanguageConfiguration): Promise<ICommentSectionFinderResult[]>  
}


export interface ICommentSectionsFinder {
  // findCommentSections(fileExtension: string, language: SupportedProgrammingLanguages): Promise<ICommentSectionFinderResult[]>
  findCommentSections(languageConfiguration: ILanguageConfiguration): Promise<ICommentSectionFinderResult[]>  
}


export class WorkspaceCommentSectionsFinder implements ICommentSectionsFinder {
  
  // findCommentSections = async (fileExtension: string, language: SupportedProgrammingLanguages): Promise<ICommentSectionFinderResult[]> => {
  findCommentSections = async (languageConfiguration: ILanguageConfiguration): Promise<ICommentSectionFinderResult[]> => {

    const x = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path);
    console.log("FS COMMENT SECTION");
    console.log(x);
    console.log(languageConfiguration);

    const languageFiles: vscode.Uri[] = [];

    
    // const allResultTasks = fileUris.map(async x => 
    //   this.createCommentSectionFinderResultForFile(x, commentLineStarterCharacters));
    
    // console.log("SECTION 1");
    // console.log(allResultTasks);

    // const allResults = await Promise.all(allResultTasks);

    const globPatternToExclude = languageConfiguration.globPatternToExclude;
    const findFileTasks = languageConfiguration.fileExtensions.map(async fileExtension => {
      const extensionFiles = await vscode.workspace.findFiles(`**/*.${fileExtension}`, globPatternToExclude);
      return extensionFiles;
      // console.log("EXTENSION FILES");
      // console.log(extensionFiles);
    });

    const allFindFileResults = await Promise.all(findFileTasks);

    allFindFileResults.forEach(r => {
      languageFiles.push(...r);
    });

    console.log("LANGUAGE FILES");
    console.log(languageFiles);

    const tsFinder = new CommentSectionsFinder();
    return tsFinder.findCommentSections(languageFiles, languageConfiguration.commentCharacters);

    // switch (language) {
    //   case 'ts': {
    //     const tsFinder = new CommentSectionsFinder();
    //     return tsFinder.findCommentSections(languageFiles, languageConfiguration.commentCharacters);
    //   }
    // }
  };
}
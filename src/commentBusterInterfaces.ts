import * as vscode from 'vscode';
import { ILanguageConfiguration } from './LanguageConfigurations';


export interface ICommentSection {
  startLineNumber: number
  endLineNumber: number
}


export interface ICommentSectionFinderResult {
  fileUri: vscode.Uri
  fileLines: string[]
  // totalLineCount: number
  commentSections: ICommentSection[]
}


export interface ICommentSectionFinderResultForProgrammingLanguage {
  findCommentSections(fileUris: vscode.Uri[], commentLineStarterCharacters: string[]): Promise<ICommentSectionFinderResult[]>
}


export interface ICommentSectionsFinder {
  findCommentSections(languageConfiguration: ILanguageConfiguration): Promise<ICommentSectionFinderResult[]>  
}


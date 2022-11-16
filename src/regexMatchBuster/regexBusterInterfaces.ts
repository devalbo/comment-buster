import * as vscode from 'vscode';
import { ILanguageConfiguration } from '../LanguageConfigurations';


export interface IRegexMatchLinesSection {
  startLineNumber: number
  endLineNumber: number
}


export interface IRegexMatchLinesSectionFinderResult {
  fileUri: vscode.Uri
  totalFileLineCount: number
  regexMatchLinesSections: IRegexMatchLinesSection[]
}


export interface IRegexMatchLinesSectionFinderResultForProgrammingLanguage {
  findRegexMatchLinesSections(fileUris: vscode.Uri[], commentLineStarterCharacters: string[]): Promise<IRegexMatchLinesSectionFinderResult[]>
}


export interface IRegexMatchLinesSectionsFinder {
  findRegexMatchLinesSections(languageConfiguration: ILanguageConfiguration): Promise<IRegexMatchLinesSectionFinderResult[]>  
}

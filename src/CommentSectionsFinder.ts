import * as vscode from 'vscode';
import { SupportedProgrammingLanguages } from "./constants";
import { CommentSectionsFinder_TypeScript } from "./CommentSectionsFinder_TypeScript";


export interface ICommentSectionFinderResult {
  fileUri: vscode.Uri
  totalLineCount: number
}


export interface ICommentSectionFinderResult_ProgrammingLanguage {
  findCommentSections(fileUris: vscode.Uri[]): Promise<ICommentSectionFinderResult[]>
}


export interface ICommentSectionsFinder {
  findCommentSections(fileExtension: string, language: SupportedProgrammingLanguages): Promise<ICommentSectionFinderResult[]>
}


export class CommentSectionsFinder implements ICommentSectionsFinder {
  
  findCommentSections = async (fileExtension: string, language: SupportedProgrammingLanguages): Promise<ICommentSectionFinderResult[]> => {
    
    const languageFiles = await vscode.workspace.findFiles(`**/*.${fileExtension}`, '**/node_modules/**');

    switch (language) {
      case 'ts': {
        const tsFinder = new CommentSectionsFinder_TypeScript();
        return tsFinder.findCommentSections(languageFiles);
      }
    }
  }
}
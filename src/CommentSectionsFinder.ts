import * as vscode from 'vscode';
import { SupportedProgrammingLanguages } from "./constants";
import { CommentSectionsFinderForTypeScript } from "./CommentSectionsFinder_TypeScript";



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
        const tsFinder = new CommentSectionsFinderForTypeScript();
        return tsFinder.findCommentSections(languageFiles);
      }
    }
  };
}
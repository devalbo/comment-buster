import * as vscode from 'vscode';


export type SupportedProgrammingLanguages = 'TypeScript' | 'Python' | 'C/C++';

export interface ILanguageConfiguration {
  commentCharacters: string[]
  getGlobPatternToInclude(): string
  getGlobPatternsToExclude(): string[]
}

const _getGlobPatternsToExclude = (configKey: string) => {
  const directoriesToExcludeStr = vscode.workspace.getConfiguration('comment-buster').get(configKey) as string;
  console.log("GETTING TS GLOB PATTERNS");
  console.log(directoriesToExcludeStr);
  const directoriesToExcludeLines = directoriesToExcludeStr.split('\n');
  const globPatternsToExclude = directoriesToExcludeLines
    .map(l => l.trim())
    .filter(l => l.length > 0);

  return globPatternsToExclude;
};


export const typeScriptLanguageConfiguration: ILanguageConfiguration = {
  commentCharacters: ['//', ],
  getGlobPatternToInclude: () => '**/*.ts',
  getGlobPatternsToExclude(): string[] {
    return _getGlobPatternsToExclude('typescript.directoriesToExclude');
  }
};

export const cLangsLanguageConfiguration: ILanguageConfiguration = {
  commentCharacters: ['//', ],
  getGlobPatternToInclude: () => '**/*.{c,cpp,h}',
  getGlobPatternsToExclude(): string[] {
    return _getGlobPatternsToExclude('clangs.directoriesToExclude');
  }
};

export const pythonLanguageConfiguration: ILanguageConfiguration = {
  commentCharacters: ['#', ],
  getGlobPatternToInclude: () => '**/*.py',
  getGlobPatternsToExclude(): string[] {
    return _getGlobPatternsToExclude('python.directoriesToExclude');
  }
};

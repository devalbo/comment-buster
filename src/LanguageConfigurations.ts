import * as vscode from 'vscode';


export type SupportedProgrammingLanguages = 'TypeScript' | 'Python' | 'C/C++';

export interface ILanguageConfiguration {
  commentCharacters: string[]
  printStatementLineRegexes: string[]

  getGlobPatternToInclude(): string
  getGlobPatternsToExclude(): string[]
}

const _getGlobPatternsToExclude = (configKey: string) => {
  const directoriesToExcludeStr = vscode.workspace.getConfiguration('comment-buster').get(configKey) as string;
  const directoriesToExcludeLines = directoriesToExcludeStr.split('\n');
  const globPatternsToExclude = directoriesToExcludeLines
    .map(l => l.trim())
    .filter(l => l.length > 0);

  return globPatternsToExclude;
};


export const typeScriptLanguageConfiguration: ILanguageConfiguration = {
  commentCharacters: ['//', ],
  printStatementLineRegexes: [`.*console\\.log\\(.*`],

  getGlobPatternToInclude: () => '**/*.ts',
  getGlobPatternsToExclude: () => _getGlobPatternsToExclude('typescript.directoriesToExclude'),
};



export const cLangsLanguageConfiguration: ILanguageConfiguration = {
  commentCharacters: ['//', ],
  printStatementLineRegexes: [],

  getGlobPatternToInclude: () => '**/*.{c,cpp,h}',
  getGlobPatternsToExclude: () => _getGlobPatternsToExclude('clangs.directoriesToExclude'),
};


export const pythonLanguageConfiguration: ILanguageConfiguration = {
  commentCharacters: ['#', ],
  printStatementLineRegexes: ['.*print(.*'],

  getGlobPatternToInclude: () => '**/*.py',
  getGlobPatternsToExclude: () => _getGlobPatternsToExclude('python.directoriesToExclude'),
};

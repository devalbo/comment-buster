import * as vscode from 'vscode';


export type SupportedProgrammingLanguages = 'TypeScript' | 'Python' | 'C/C++';

export interface ILanguageConfiguration {
  // fileExtensions: string[]
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
}


export const TypeScriptLanguageConfiguration: ILanguageConfiguration = {
  // fileExtensions: ['ts', ],
  commentCharacters: ['//', ],
  getGlobPatternToInclude: () => '**/*.ts',
  // globPatternToExclude: '**/node_modules/**',
  getGlobPatternsToExclude(): string[] {
    return _getGlobPatternsToExclude('typescript.directoriesToExclude');

    // const directoriesToExcludeStr = vscode.workspace.getConfiguration('comment-buster').get('typescript.directoriesToExclude') as string;
    // console.log("GETTING TS GLOB PATTERNS");
    // console.log(directoriesToExcludeStr);
    // const directoriesToExcludeLines = directoriesToExcludeStr.split('\n');
    // const globPatternsToExclude = directoriesToExcludeLines
    //   .map(l => l.trim())
    //   .filter(l => l.length > 0);

    // return globPatternsToExclude;

    // return [
    //   '**/node_modules/**',
    // ];
  }
};

export const CLangs_LanguageConfiguration: ILanguageConfiguration = {
  // fileExtensions: ['h', 'c', 'cpp', ],
  // {}` to group conditions (e.g. `**​/*.{ts,js}` matches all TypeScript and JavaScript files)
  commentCharacters: ['//', ],
  getGlobPatternToInclude: () => '**/*.{c,cpp,h}',
  getGlobPatternsToExclude(): string[] {
    return _getGlobPatternsToExclude('clangs.directoriesToExclude');
    // return [
    //   '**/.pio/**',
    // ];
  }
};

export const PythonLanguageConfiguration: ILanguageConfiguration = {
  commentCharacters: ['#', ],
  // fileExtensions: ['py', ],
  // globPatternToInclude: '**/*.py',
  getGlobPatternToInclude: () => '**/*.py',
  getGlobPatternsToExclude(): string[] {
    // return [];
    return _getGlobPatternsToExclude('python.directoriesToExclude');
  }
};

// export const CustomConfiguration: ILanguageConfiguration = {

// }
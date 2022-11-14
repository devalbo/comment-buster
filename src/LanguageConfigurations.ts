
export type SupportedProgrammingLanguages = 'TypeScript' | 'Python' | 'C/C++';

export interface ILanguageConfiguration {
  fileExtensions: string[]
  commentCharacters: string[]
  globPatternToExclude: string | undefined
}


export const TypeScriptLanguageConfiguration: ILanguageConfiguration = {
  fileExtensions: ['ts', ],
  commentCharacters: ['//', ],
  globPatternToExclude: '**/node_modules/**',
};

export const C_Cplusplus_LanguageConfiguration: ILanguageConfiguration = {
  fileExtensions: ['h', 'c', 'cpp', ],
  commentCharacters: ['//', ],
  globPatternToExclude: '**/.pio/**',
};

export const PythonLanguageConfiguration: ILanguageConfiguration = {
  fileExtensions: ['py', ],
  commentCharacters: ['#', ],
  globPatternToExclude: undefined,
};
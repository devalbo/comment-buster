import * as assert from 'assert';
import { typeScriptLanguageConfiguration } from '../../LanguageConfigurations';
// import { IRegexMatchLinesSection } from '../../regexMatchBuster/regexBusterInterfaces';
// import { RflmLineClassifications, classifyLine, findMatchingRegexSectionsForLines, matchLineClassifications } from '../../regexMatchBuster/RegexesForLinesMatcher';

// interface ILineRegexTestCase {
//   line: string,
//   regexes: string[],
//   expectedResult: RflmLineClassifications,
// }

// class LineRegexTestCase implements ILineRegexTestCase {
//   line: string;
//   regexes: string[];
//   expectedResult: RflmLineClassifications;

//   constructor(line: string, regexes: string[], expectedResult: RflmLineClassifications) {
//     this.line = line;
//     this.regexes = regexes;
//     this.expectedResult = expectedResult;
//   }
// }

// interface IParseLineClassificationsTestCase {
//   lineClassifications: string,
//   expectedResult: any,
// }

// class ParseLineClassificationsTestCase implements IParseLineClassificationsTestCase {
//   lineClassifications: string;
//   expectedResult: IRegexMatchLinesSection[];

//   constructor(lineClassifications: string, expectedResult: IRegexMatchLinesSection[]) {
//     this.lineClassifications = lineClassifications;
//     this.expectedResult = expectedResult;
//   }
// }


suite('LanguageConfiguration Test Suite', () => {

  test('valid regexes for TypeScript', async () => {
    
    // Arrange
    const languageConfiguration = typeScriptLanguageConfiguration;
    const typeScriptPrintStatementRegex = languageConfiguration.printStatementLineRegexes[0];

    // Act
    const regex = new RegExp(typeScriptPrintStatementRegex);

    // Assert
    assert.notEqual(null, regex);
    assert.notEqual(undefined, regex);
  });
});

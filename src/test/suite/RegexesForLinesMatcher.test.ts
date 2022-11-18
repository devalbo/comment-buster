
// import { assert } from 'console';
import * as assert from 'assert';
import { IRegexMatchLinesSection } from '../../regexMatchBuster/regexBusterInterfaces';
import { RflmLineClassifications, classifyLine, findMatchingRegexSectionsForLines, matchLineClassifications } from '../../regexMatchBuster/RegexesForLinesMatcher';

interface ILineRegexTestCase {
  line: string,
  regexes: string[],
  expectedResult: RflmLineClassifications,
}

class LineRegexTestCase implements ILineRegexTestCase {
  line: string;
  regexes: string[];
  expectedResult: RflmLineClassifications;

  constructor(line: string, regexes: string[], expectedResult: RflmLineClassifications) {
    this.line = line;
    this.regexes = regexes;
    this.expectedResult = expectedResult;
  }
}

interface IParseLineClassificationsTestCase {
  lineClassifications: string,
  expectedResult: any,
}

class ParseLineClassificationsTestCase implements IParseLineClassificationsTestCase {
  lineClassifications: string;
  expectedResult: IRegexMatchLinesSection[];

  constructor(lineClassifications: string, expectedResult: IRegexMatchLinesSection[]) {
    this.lineClassifications = lineClassifications;
    this.expectedResult = expectedResult;
  }
}


suite('RegexesForLinesMatcher Test Suite', () => {

  test('classifyLine with regexes - 1', async () => {
    
    // Arrange
    const regexes = [
      '.*',
    ];
    
    const testCases: ILineRegexTestCase[] = [
      new LineRegexTestCase('', regexes, 'e'),
      new LineRegexTestCase('   ', regexes, 'e'),
      new LineRegexTestCase('abc', regexes, 'm'),
      new LineRegexTestCase('  //', regexes, 'm'),
    ];

    // Act / Assert
    for (let i=0; i < testCases.length; i++) {
      const testLine = testCases[i].line;
      const testRegexes = testCases[i].regexes;
      const expectedResult = testCases[i].expectedResult;

      const result = classifyLine(testLine, testRegexes);

      assert.strictEqual(expectedResult, result);
    }
  });


  test('classifyLine with regexes - 2', async () => {
    
    // Arrange
    const regexes = [
      '.*console\\.log\\(.*',
      '.*print\\(.*',
    ];
    
    const testCases: ILineRegexTestCase[] = [
      new LineRegexTestCase('', regexes, 'e'),
      new LineRegexTestCase('  console.log("abc"); ', regexes, 'm'),
      new LineRegexTestCase('  print("bob")   # other stuff', regexes, 'm'),
      new LineRegexTestCase('abc', regexes, 'x'),
      new LineRegexTestCase('  //', regexes, 'x'),
    ];

    // Act / Assert
    for (let i=0; i < testCases.length; i++) {
      const testLine = testCases[i].line;
      const testRegexes = testCases[i].regexes;
      const expectedResult = testCases[i].expectedResult;

      const result = classifyLine(testLine, testRegexes);

      assert.strictEqual(expectedResult, result);
    }
  });


  test('simple parseLineClassifications', async () => {
    
    // Arrange
    const testCases: ParseLineClassificationsTestCase[] = [
      new ParseLineClassificationsTestCase('', []),
      new ParseLineClassificationsTestCase('x', []),
      new ParseLineClassificationsTestCase('e', []),
      new ParseLineClassificationsTestCase('m', [{startLineNumber: 1, endLineNumber: 1}]),
      new ParseLineClassificationsTestCase('eme', [{startLineNumber: 2, endLineNumber: 2}]),
      new ParseLineClassificationsTestCase('xme', [{startLineNumber: 2, endLineNumber: 2}]),
      new ParseLineClassificationsTestCase('exme', [{startLineNumber: 3, endLineNumber: 3}]),
      new ParseLineClassificationsTestCase('xmx', [{startLineNumber: 2, endLineNumber: 2}]),
      new ParseLineClassificationsTestCase('xmeme', [{startLineNumber: 2, endLineNumber: 4}]),
      new ParseLineClassificationsTestCase('exmemxe', [{startLineNumber: 3, endLineNumber: 5}]),
    ];

    // Act / Assert
    for (let i=0; i < testCases.length; i++) {
      const lineClassifications = testCases[i].lineClassifications.split('') as RflmLineClassifications[];
      const expectedResults = testCases[i].expectedResult;

      const actualMatchResults = matchLineClassifications(lineClassifications);
      const expectedMatchResults = expectedResults;

      assert.deepEqual(expectedMatchResults, actualMatchResults, "Expected match section result does not equal actual match section result");
    }
  });

    
  test('complex parseLineClassifications - 1', async () => {
    
    // Arrange
    const lineClassifications = "eeexxmmmeemxxxxeemmemxxxmxxxemmeexmeemeemxxxxmeexxmmxxmeem".split('') as RflmLineClassifications[];
    const expectedSections    = "     mmmmmm      mmmm   m    mm   mmmmmmm    m    mm  mmmm";
    
    const expectedResult = [
      {startLineNumber: 6, endLineNumber: 11},
      {startLineNumber: 18, endLineNumber: 21},
      {startLineNumber: 25, endLineNumber: 25},
      {startLineNumber: 30, endLineNumber: 31},
      {startLineNumber: 35, endLineNumber: 41},
      {startLineNumber: 46, endLineNumber: 46},
      {startLineNumber: 51, endLineNumber: 52},
      {startLineNumber: 55, endLineNumber: 58},
    ] as IRegexMatchLinesSection[];

    // Act
    const result = matchLineClassifications(lineClassifications);

    // Assert
    assert.deepEqual(result, expectedResult);
  });


  test('findMatchingRegexSectionsForLines - 1', async () => {
    
    // Arrange
    const testRegexes = [
      '.*console\\.log\\(.*',
      '.*print\\(.*',
    ];

    const testLines = `
      console.log("blah");

      not real code but shouldn't match

      print("blah2")
      print("moar print")

      not real code either

      print("python")
      console.log("TypeScript");

      print("more python")

      some also not real code

      console.log("also blah")
    `.split("\n");
    
    // Act
    const result = findMatchingRegexSectionsForLines(testLines, testRegexes);

    // Assert
    assert.deepEqual([
      {startLineNumber: 2, endLineNumber: 2},
      {startLineNumber: 6, endLineNumber: 7},
      {startLineNumber: 11, endLineNumber: 14},
      {startLineNumber: 18, endLineNumber: 18},
    ], result);
  });

});


// import { assert } from 'console';
import * as assert from 'assert';
import { RflmLineClassifications, classifyLine } from '../../regexMatchBuster/RegexesForLinesMatcher';

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

suite('RegexesForLinesMatcher Test Suite', () => {

  test('find lines in code sample that match regexes 1', async () => {
    
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

  test('find lines in code sample that match regexes 2', async () => {
    
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


});

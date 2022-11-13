import * as assert from 'assert';
import * as path from 'path';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { CommentSectionsFinder_TypeScript } from '../../CommentSectionsFinder_TypeScript';

suite('CommentSectionsFinder_TypeScript Test Suite', () => {

  const _sut = new CommentSectionsFinder_TypeScript();

	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

  test('find comments in SampleFile.ts.abc', async () => {
    
    // Arrange
    const sampleFilePath = path.resolve(__dirname, './SampleFile.ts.abc');
    const sampleFileUri = vscode.Uri.file(sampleFilePath);

    // Act
    const result = await _sut.createCommentSectionFinderResultForFile(sampleFileUri);

    // Assert
    assert.strictEqual(124, result.totalLineCount);
    assert.strictEqual('abc', result.fileUri.fsPath);

    console.log(result);
  });
});

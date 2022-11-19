import * as assert from 'assert';
import * as path from 'path';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { CommentSectionsFinder } from '../../commentBuster/CommentSectionsFinder';


suite('CommentSectionsFinder Test Suite', () => {

  const _sut = new CommentSectionsFinder();

	vscode.window.showInformationMessage('Start all tests.');

  test('find comment lines in code sample 1', async () => {
    
    // Arrange
    const sampleLines = `
    //

    //

xyz
    `.split('\n');

    // Act
    const result = _sut.findCommentSectionsForLines(sampleLines, ['//']);

    // Assert
    assert.strictEqual(1, result.length);
    assert.deepEqual([
      {
        startLineNumber: 2,
        endLineNumber: 4,
      }], result);

    console.log(result);
  });

  test('find comment lines in code sample 2', async () => {
    
    // Arrange
    const sampleLines = ` fd

    blah blab

    //
    //

    //

    abc

    //
    //


//
xyz
    `.split('\n');

    // Act
    const result = await _sut.findCommentSectionsForLines(sampleLines, ['//']);

    // Assert
    assert.strictEqual(2, result.length);
    assert.deepEqual([
      {
        startLineNumber: 5,
        endLineNumber: 8,
      },
      {
        startLineNumber: 12,
        endLineNumber: 16,
      }], result);

    console.log(result);
  });
});

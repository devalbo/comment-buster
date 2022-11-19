import * as assert from 'assert';
import { typeScriptLanguageConfiguration } from '../../LanguageConfigurations';


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

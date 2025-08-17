import * as assert from 'assert';
import { Parser } from '../../Parser';
import { Config } from '../../types';

const config: Config = { placeholder: true };

suite('JavaScript Test Suite', () => {
  test('Standard function with variable declaration', () => {
    const input = `function calculateSum(a, b) {\nconst result = a + b;\nreturn result;\n}
`;
    const { body } = new Parser(input, config, 'javascript');

    assert.deepStrictEqual(body, [
      'function ${1:calculateSum}(a, b) {',
      'const result = a + b;',
      'return result;',
      '}',
    ]);
  });
});

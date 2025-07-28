import * as assert from 'assert';
import { Parser } from '../Parser';

suite('Parser Test Suite', () => {
  test('Replace function name with tab stop', () => {
    const input = `function foo()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], `function $1()`);
  });
});

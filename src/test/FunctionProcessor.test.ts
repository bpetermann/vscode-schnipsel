import * as assert from 'assert';
import { FunctionProcessor } from '../Processor';

const TAB_ID = 1;
const FUNCTION_NAME = 'foo';

suite('FunctionProcessor Test Suite', () => {
  test('Replaces simple function name with placeholder and keeps identifier', () => {
    const inputTokens = ['function', `${FUNCTION_NAME}()`];
    const name = inputTokens[1];
    const index = 1;

    const { tokens, identifier, tabStop } = new FunctionProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], '${1:foo}()');
    assert.strictEqual(identifier, FUNCTION_NAME);
    assert.strictEqual(tabStop, '$1');
  });

  test('Handles function names with parameters', () => {
    const inputTokens = ['function', `${FUNCTION_NAME}(a,`, 'b)'];
    const name = inputTokens[1];
    const index = 1;

    const { tokens, identifier } = new FunctionProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], `\${1:${FUNCTION_NAME}}(a,`);
    assert.strictEqual(identifier, FUNCTION_NAME);
  });

  test('Handles function names with no parentheses', () => {
    const inputTokens = ['function', FUNCTION_NAME];
    const index = 1;

    const { tokens, identifier } = new FunctionProcessor(
      inputTokens.slice(),
      FUNCTION_NAME,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], '${1:foo}');
    assert.strictEqual(identifier, FUNCTION_NAME);
  });

  test('Replaces only the target index', () => {
    const inputTokens = ['function', 'foo()', 'function', 'bar()'];
    const name = inputTokens[3];
    const index = 3;

    const { tokens } = new FunctionProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], 'foo()');
    assert.strictEqual(tokens[3], '${1:bar}()');
  });

  test('Does not modify unrelated tokens', () => {
    const inputTokens = ['export', 'function', 'foo()'];
    const name = inputTokens[2];
    const index = 2;

    const { tokens } = new FunctionProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.deepStrictEqual(tokens[0], inputTokens[0]);
    assert.deepStrictEqual(tokens[1], inputTokens[1]);
  });

  test('Handles nested/extra parentheses and splits only on the first "("', () => {
    const inputTokens = ['function', 'fn(a)(b)'];
    const name = inputTokens[1];
    const index = 1;

    const { tokens, identifier } = new FunctionProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], '${1:fn}(a)(b)');
    assert.strictEqual(identifier, 'fn');
  });

  test('Handles numeric identifiers in function name', () => {
    const inputTokens = ['function', 'fetch1()'];
    const name = inputTokens[1];
    const index = 1;

    const { tokens, identifier } = new FunctionProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], '${1:fetch1}()');
    assert.strictEqual(identifier, 'fetch1');
  });

  test('Works correctly when function token contains multiple delimiters', () => {
    const inputTokens = ['function', `${FUNCTION_NAME}(a)(b)(c)`];
    const name = inputTokens[1];
    const index = 1;

    const { tokens, identifier } = new FunctionProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], `\${1:${FUNCTION_NAME}}(a)(b)(c)`);
    assert.strictEqual(identifier, FUNCTION_NAME);
  });
});

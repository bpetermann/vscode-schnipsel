import * as assert from 'assert';
import { FunctionProcessor } from '../Processor';
import { TabStop } from '../TabStop';

const TAB_ID = 1;
const FUNCTION_NAME = 'foo';

suite('FunctionProcessor Test Suite', () => {
  test('Replaces simple function name with placeholder and keeps identifier', () => {
    const inputTokens = ['function', `${FUNCTION_NAME}()`];
    const index = 1;
    const name = inputTokens[index];

    const { tokens, tabStop } = new FunctionProcessor(
      inputTokens.slice(),
      new TabStop(name, index, TAB_ID)
    ).process();

    assert.strictEqual(tokens[1], '${1:foo}()');
    assert.strictEqual(tabStop.name, FUNCTION_NAME);
    assert.strictEqual(tabStop.value, '$1');
  });

  test('Handles function names with parameters', () => {
    const inputTokens = ['function', `${FUNCTION_NAME}(a,`, 'b)'];
    const index = 1;
    const name = inputTokens[index];

    const { tokens, tabStop } = new FunctionProcessor(
      inputTokens.slice(),
      new TabStop(name, index, TAB_ID)
    ).process();

    assert.strictEqual(tokens[1], `\${1:${FUNCTION_NAME}}(a,`);
    assert.strictEqual(tabStop.name, FUNCTION_NAME);
  });

  test('Handles function names with no parentheses', () => {
    const inputTokens = ['function', FUNCTION_NAME];
    const index = 1;

    const { tokens, tabStop } = new FunctionProcessor(
      inputTokens.slice(),
      new TabStop(FUNCTION_NAME, index, TAB_ID)
    ).process();

    assert.strictEqual(tokens[1], '${1:foo}');
    assert.strictEqual(tabStop.name, FUNCTION_NAME);
  });

  test('Replaces only the target index', () => {
    const inputTokens = ['function', 'foo()', 'function', 'bar()'];
    const index = 3;
    const name = inputTokens[index];

    const { tokens } = new FunctionProcessor(
      inputTokens.slice(),
      new TabStop(name, index, TAB_ID)
    ).process();

    assert.strictEqual(tokens[1], 'foo()');
    assert.strictEqual(tokens[3], '${1:bar}()');
  });

  test('Does not modify unrelated tokens', () => {
    const inputTokens = ['export', 'function', 'foo()'];
    const index = 2;
    const name = inputTokens[index];

    const { tokens } = new FunctionProcessor(
      inputTokens.slice(),
      new TabStop(name, index, TAB_ID)
    ).process();

    assert.deepStrictEqual(tokens[0], inputTokens[0]);
    assert.deepStrictEqual(tokens[1], inputTokens[1]);
  });

  test('Handles nested/extra parentheses and splits only on the first "("', () => {
    const inputTokens = ['function', 'fn(a)(b)'];
    const index = 1;
    const name = inputTokens[index];

    const { tokens, tabStop } = new FunctionProcessor(
      inputTokens.slice(),
      new TabStop(name, index, TAB_ID)
    ).process();

    assert.strictEqual(tokens[1], '${1:fn}(a)(b)');
    assert.strictEqual(tabStop.name, 'fn');
  });

  test('Handles numeric identifiers in function name', () => {
    const inputTokens = ['function', 'fetch1()'];
    const index = 1;
    const name = inputTokens[index];

    const { tokens, tabStop } = new FunctionProcessor(
      inputTokens.slice(),
      new TabStop(name, index, TAB_ID)
    ).process();

    assert.strictEqual(tokens[1], '${1:fetch1}()');
    assert.strictEqual(tabStop.name, 'fetch1');
  });

  test('Works correctly when function token contains multiple delimiters', () => {
    const inputTokens = ['function', `${FUNCTION_NAME}(a)(b)(c)`];
    const index = 1;
    const name = inputTokens[index];

    const { tokens, tabStop } = new FunctionProcessor(
      inputTokens.slice(),
      new TabStop(name, index, TAB_ID)
    ).process();

    assert.strictEqual(tokens[1], `\${1:${FUNCTION_NAME}}(a)(b)(c)`);
    assert.strictEqual(tabStop.name, FUNCTION_NAME);
  });
});

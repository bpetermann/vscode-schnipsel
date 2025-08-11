import * as assert from 'assert';
import { ConstProcessor } from '../Processor';

const TAB_ID = 1;
const FUNCTION_NAME = 'foo';

suite('ConstProcessor Test Suite', () => {
  test('Replaces const name for arrow function with placeholder', () => {
    const inputTokens = ['const', FUNCTION_NAME, '=', '(', ')', '=>', '{}'];
    const index = 1;

    const { tokens, identifier, tabStop } = new ConstProcessor(
      inputTokens.slice(),
      FUNCTION_NAME,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], '${1:foo}');
    assert.strictEqual(identifier, FUNCTION_NAME);
    assert.strictEqual(tabStop, '$1');
  });

  test('Detects async arrow function and replaces name', () => {
    const inputTokens = ['const', 'doWork', '=', 'async', '(', ')', '=>', '{}'];
    const name = inputTokens[1];
    const index = 1;

    const { tokens, tabStop } = new ConstProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], '${1:doWork}');
    assert.strictEqual(tabStop, '$1');
  });

  test('Does not replace const name for non-arrow function value', () => {
    const inputTokens = ['const', 'value', '=', '42'];
    const name = inputTokens[1];
    const index = 1;

    const { tokens, tabStop } = new ConstProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], 'value');
    assert.strictEqual(tabStop, null);
  });

  test('Handles irregular spacing before arrow function', () => {
    const inputTokens = [
      'const',
      'sum',
      '',
      '=',
      '',
      '(',
      'a',
      ',',
      'b',
      ')',
      '=>',
      '{}',
    ];
    const name = inputTokens[1];
    const index = 1;

    const { tokens } = new ConstProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], '${1:sum}');
  });

  test('Only replaces token at target index', () => {
    const inputTokens = [
      'const',
      'x',
      '=',
      '42',
      'const',
      'y',
      '=',
      '(',
      ')',
      '=>',
      '{}',
    ];
    const name = inputTokens[5];
    const index = 5;

    const { tokens } = new ConstProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], 'x');
    assert.strictEqual(tokens[5], '${1:y}');
  });

  test('Identifier matches original name even after replacement', () => {
    const inputTokens = ['const', FUNCTION_NAME, '=', '(', ')', '=>', '{}'];
    const index = 1;

    const { identifier } = new ConstProcessor(
      inputTokens.slice(),
      FUNCTION_NAME,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(identifier, FUNCTION_NAME);
  });

  test('Return tabStop "null" if it is not an arrow function', () => {
    const inputTokens = ['const', FUNCTION_NAME, '=', '1'];
    const index = 1;

    const { tabStop } = new ConstProcessor(
      inputTokens.slice(),
      FUNCTION_NAME,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tabStop, null);
  });
});

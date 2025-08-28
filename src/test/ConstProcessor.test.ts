import * as assert from 'assert';
import { ConstProcessor } from '../Processor';
import { TabStop } from '../TabStop';

const TAB_ID = 1;
const FUNCTION_NAME = 'foo';

suite('ConstProcessor Test Suite', () => {
  test('Replaces const name for arrow function with placeholder', () => {
    const inputTokens = ['const', FUNCTION_NAME, '=', '(', ')', '=>', '{}'];
    const index = 1;

    const { tokens, tabStop } = new ConstProcessor(
      inputTokens.slice(),
      new TabStop(FUNCTION_NAME, index, TAB_ID)
    ).process();

    assert.strictEqual(tokens[1], '${1:foo}');
    assert.strictEqual(tabStop.name, FUNCTION_NAME);
    assert.strictEqual(tabStop.value, '$1');
  });

  test('Detects async arrow function and replaces name', () => {
    const inputTokens = ['const', 'doWork', '=', 'async', '(', ')', '=>', '{}'];
    const index = 1;
    const name = inputTokens[index];

    const { tokens, tabStop } = new ConstProcessor(
      inputTokens.slice(),
      new TabStop(name, index, TAB_ID)
    ).process();

    assert.strictEqual(tokens[1], '${1:doWork}');
    assert.strictEqual(tabStop.value, '$1');
  });

  test('Does not replace const name for non-arrow function value', () => {
    const inputTokens = ['const', 'value', '=', '42'];
    const index = 1;
    const name = inputTokens[index];

    const { tokens, tabStop } = new ConstProcessor(
      inputTokens.slice(),
      new TabStop(name, index, TAB_ID)
    ).process();

    assert.strictEqual(tokens[1], 'value');
    assert.strictEqual(tabStop.id, null);
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
    const index = 1;
    const name = inputTokens[index];

    const { tokens } = new ConstProcessor(
      inputTokens.slice(),
      new TabStop(name, index, TAB_ID)
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
    const index = 5;
    const name = inputTokens[index];

    const { tokens } = new ConstProcessor(
      inputTokens.slice(),
      new TabStop(name, index, TAB_ID)
    ).process();

    assert.strictEqual(tokens[1], 'x');
    assert.strictEqual(tokens[5], '${1:y}');
  });

  test('Identifier matches original name even after replacement', () => {
    const inputTokens = ['const', FUNCTION_NAME, '=', '(', ')', '=>', '{}'];
    const index = 1;

    const { tabStop } = new ConstProcessor(
      inputTokens.slice(),
      new TabStop(FUNCTION_NAME, index, TAB_ID)
    ).process();

    assert.strictEqual(tabStop.name, FUNCTION_NAME);
  });

  test('Return tabStop "null" if it is not an arrow function', () => {
    const inputTokens = ['const', FUNCTION_NAME, '=', '1'];
    const index = 1;

    const { tabStop } = new ConstProcessor(
      inputTokens.slice(),
      new TabStop(FUNCTION_NAME, index, TAB_ID)
    ).process();

    assert.strictEqual(tabStop.id, null);
  });

  test('Replaces context name with a placeholder', () => {
    const inputTokens = [
      'const',
      FUNCTION_NAME,
      '=',
      'createContext<ThemeContextValue',
      '|',
      'null>(null)',
    ];
    const index = 1;

    const { tokens } = new ConstProcessor(
      inputTokens.slice(),
      new TabStop(FUNCTION_NAME, index, TAB_ID),
      'typescriptreact'
    ).process();

    assert.strictEqual(tokens[1], '${1:foo}');
  });

  test('Replaces forwardRef name with a placeholder', () => {
    const inputTokens = [
      'const',
      FUNCTION_NAME,
      '=',
      'forwardRef<HTMLButtonElement, ButtonProps>(',
      '(',
      'props,',
      'ref)',
      '=>',
      '{',
      '...})',
    ];
    const index = 1;

    const { tokens } = new ConstProcessor(
      inputTokens.slice(),
      new TabStop(FUNCTION_NAME, index, TAB_ID),
      'typescriptreact'
    ).process();

    assert.strictEqual(tokens[1], '${1:foo}');
  });

  test('Replaces lazy name with a placeholder', () => {
    const inputTokens = [
      'const',
      FUNCTION_NAME,
      '=',
      'lazy(',
      '()',
      '=>',
      'import(',
      "'./MyComponent')",
      ')',
    ];
    const index = 1;

    const { tokens } = new ConstProcessor(
      inputTokens.slice(),
      new TabStop(FUNCTION_NAME, index, TAB_ID),
      'typescriptreact'
    ).process();

    assert.strictEqual(tokens[1], '${1:foo}');
  });
});

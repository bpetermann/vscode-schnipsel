import * as assert from 'assert';
import { TabStopReplacer } from '../Replacer';

const TABSTOP_MAP = new Map([['MyComponent', '$1']]);

suite('TabStopReplacer Test Suite', () => {
  test('Replaces a matching whole-word identifier with its mapped value', () => {
    const tokens = ['function', 'MyComponent', '(', ')', '{'];

    const replacer = new TabStopReplacer(tokens, TABSTOP_MAP);
    const result = replacer.apply();

    assert.deepStrictEqual(result, ['function', '$1', '(', ')', '{']);
  });

  test('Does not replace partial matches', () => {
    const tokens = ['MyComponentExtra'];

    const replacer = new TabStopReplacer(tokens, TABSTOP_MAP);
    const result = replacer.apply();

    assert.deepStrictEqual(result, tokens);
  });

  test('Does not replace identifiers that are object property keys', () => {
    const tokens = ['MyComponent:'];

    const replacer = new TabStopReplacer(tokens, TABSTOP_MAP);
    const result = replacer.apply();

    assert.deepStrictEqual(result, tokens);
  });

  test('does not replace identifiers inside string literals', () => {
    const tokens = ["'MyComponent'", '"MyComponent"'];

    const replacer = new TabStopReplacer(tokens, TABSTOP_MAP);
    const result = replacer.apply();

    assert.deepStrictEqual(result, tokens);
  });

  test('returns unchanged tokens if no matches are found', () => {
    const tokens = ['function', 'OtherName', '(', ')', '{'];

    const replacer = new TabStopReplacer(tokens, TABSTOP_MAP);
    const result = replacer.apply();

    assert.deepStrictEqual(result, tokens);
  });

  test('replaces multiple different identifiers in the same token array', () => {
    const tokens = ['class', 'MyClass', 'extends', 'BaseClass', '{'];
    const map = new Map([
      ['MyClass', '$1'],
      ['BaseClass', '$2'],
    ]);

    const replacer = new TabStopReplacer(tokens, map);
    const result = replacer.apply();

    assert.deepStrictEqual(result, ['class', '$1', 'extends', '$2', '{']);
  });
});

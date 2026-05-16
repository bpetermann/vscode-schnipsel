import * as assert from 'assert';
import { join, tokenize } from '../Tokenizer';

suite('Tokenizer Test Suite', () => {
  test('Splits a normal line into tokens', () => {
    assert.deepStrictEqual(tokenize('const foo = 5'), [
      'const',
      'foo',
      '=',
      '5',
    ]);
  });

  test('Filters interior empty strings from multi-space input', () => {
    assert.deepStrictEqual(tokenize('function   foo()'), ['function', 'foo()']);
  });

  test('Preserves leading empty tokens for indented lines', () => {
    assert.deepStrictEqual(tokenize('  const foo = 5'), [
      '',
      '',
      'const',
      'foo',
      '=',
      '5',
    ]);
  });

  test('Filters both leading-indent and interior multi-space', () => {
    assert.deepStrictEqual(tokenize('  function   foo()'), [
      '',
      '',
      'function',
      'foo()',
    ]);
  });

  test('Returns a single-element array for a single-token line', () => {
    assert.deepStrictEqual(tokenize('function'), ['function']);
  });

  test('Returns an empty array for an empty line', () => {
    assert.deepStrictEqual(tokenize(''), []);
  });

  test('Returns an empty array for a whitespace-only line', () => {
    assert.deepStrictEqual(tokenize('   '), []);
  });

  test('join reconstructs a token array as a single-spaced string', () => {
    assert.strictEqual(join(['const', 'foo', '=', '5']), 'const foo = 5');
  });

  test('join returns empty string for empty array', () => {
    assert.strictEqual(join([]), '');
  });
});

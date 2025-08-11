import * as assert from 'assert';
import { ClassProcessor } from '../Processor';

const TAB_ID = 1;
const CLASS_NAME = 'MyClass';

suite('ClassProcessor Test Suite', () => {
  test('Replaces simple class name with placeholder and keeps identifier', () => {
    const inputTokens = ['class', 'MyClass{'];
    const name = inputTokens[1];
    const index = 1;

    const { tokens, identifier, tabStop } = new ClassProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], '${1:MyClass}{');
    assert.strictEqual(identifier, CLASS_NAME);
    assert.strictEqual(tabStop, '$1');
  });

  test('Handles class names with spaces before brace', () => {
    const inputTokens = ['class', CLASS_NAME, '{'];
    const index = 1;

    const { tokens, identifier } = new ClassProcessor(
      inputTokens.slice(),
      CLASS_NAME,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], '${1:MyClass}');
    assert.strictEqual(identifier, CLASS_NAME);
  });

  test('Handles unusual but possible class token without brace', () => {
    const inputTokens = ['export', 'class', 'Thing'];
    const name = inputTokens[2];
    const index = 2;

    const { tokens, identifier, tabStop } = new ClassProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[2], '${1:Thing}');
    assert.strictEqual(identifier, 'Thing');
    assert.strictEqual(tabStop, '$1');
  });

  test('Replaces only the target index', () => {
    const inputTokens = ['class', 'One{', 'class', 'Two{'];
    const name = inputTokens[3];
    const index = 3;

    const { tokens } = new ClassProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], 'One{');
    assert.strictEqual(tokens[3], '${1:Two}{');
  });

  test('Does not modify unrelated tokens', () => {
    const inputTokens = ['export', 'class', 'Foo{'];
    const name = inputTokens[2];
    const index = 2;

    const { tokens } = new ClassProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.deepStrictEqual(tokens[0], inputTokens[0]);
    assert.deepStrictEqual(tokens[1], inputTokens[1]);
  });
});

import * as assert from 'assert';
import { ClassProcessor } from '../Processor';
import { TabStop } from '../TabStop';

const TAB_ID = 1;
const CLASS_NAME = 'MyClass';

suite('ClassProcessor Test Suite', () => {
  test('Replaces simple class name with placeholder and keeps identifier', () => {
    const inputTokens = ['class', 'MyClass{'];
    const index = 1;
    const name = inputTokens[index];

    const { tokens, tabStop } = new ClassProcessor(
      inputTokens.slice(),
      new TabStop(name, index, TAB_ID)
    ).process();

    assert.strictEqual(tokens[1], '${1:MyClass}{');
    assert.strictEqual(tabStop.name, CLASS_NAME);
    assert.strictEqual(tabStop.value, '$1');
  });

  test('Handles class names with spaces before brace', () => {
    const inputTokens = ['class', CLASS_NAME, '{'];
    const index = 1;

    const { tokens, tabStop } = new ClassProcessor(
      inputTokens.slice(),
      new TabStop(CLASS_NAME, index, TAB_ID)
    ).process();

    assert.strictEqual(tokens[1], '${1:MyClass}');
    assert.strictEqual(tabStop.name, CLASS_NAME);
  });

  test('Handles unusual but possible class token without brace', () => {
    const inputTokens = ['export', 'class', 'Thing'];
    const index = 2;
    const name = inputTokens[index];

    const { tokens, tabStop } = new ClassProcessor(
      inputTokens.slice(),
      new TabStop(name, index, TAB_ID)
    ).process();

    assert.strictEqual(tokens[2], '${1:Thing}');
    assert.strictEqual(tabStop.name, 'Thing');
    assert.strictEqual(tabStop.value, '$1');
  });

  test('Replaces only the target index', () => {
    const inputTokens = ['class', 'One{', 'class', 'Two{'];
    const index = 3;
    const name = inputTokens[index];

    const { tokens } = new ClassProcessor(
      inputTokens.slice(),
      new TabStop(name, index, TAB_ID)
    ).process();

    assert.strictEqual(tokens[1], 'One{');
    assert.strictEqual(tokens[3], '${1:Two}{');
  });

  test('Does not modify unrelated tokens', () => {
    const inputTokens = ['export', 'class', 'Foo{'];
    const index = 2;
    const name = inputTokens[index];

    const { tokens } = new ClassProcessor(
      inputTokens.slice(),
      new TabStop(name, index, TAB_ID)
    ).process();

    assert.deepStrictEqual(tokens[0], inputTokens[0]);
    assert.deepStrictEqual(tokens[1], inputTokens[1]);
  });
});

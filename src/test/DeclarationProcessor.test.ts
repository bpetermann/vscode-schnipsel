import * as assert from 'assert';
import { DeclarationProcessor } from '../Processor';

const TAB_ID = 1;
const TYPE_NAME = 'MyType';

suite('DeclarationProcessor Test Suite', () => {
  test('Replaces declaration name with placeholder and keeps identifier', () => {
    const inputTokens = ['type', TYPE_NAME];
    const index = 1;

    const { tokens, identifier, tabStop } = new DeclarationProcessor(
      inputTokens.slice(),
      TYPE_NAME,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], '${1:MyType}');
    assert.strictEqual(identifier, TYPE_NAME);
    assert.strictEqual(tabStop, '$1');
  });

  test('Handles declaration names with special characters', () => {
    const inputTokens = ['type', 'My_Type'];
    const name = inputTokens[1];
    const index = 1;

    const { tokens, identifier } = new DeclarationProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], '${1:My_Type}');
    assert.strictEqual(identifier, 'My_Type');
  });

  test('Handles single-token declarations', () => {
    const inputTokens = [TYPE_NAME];
    const index = 0;

    const { tokens, identifier } = new DeclarationProcessor(
      inputTokens.slice(),
      TYPE_NAME,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[0], '${1:MyType}');
    assert.strictEqual(identifier, TYPE_NAME);
  });

  test('Replaces only the target index', () => {
    const inputTokens = ['type', 'A', 'type', 'B'];
    const name = inputTokens[3];
    const index = 3;

    const { tokens } = new DeclarationProcessor(
      inputTokens.slice(),
      name,
      index,
      TAB_ID
    ).process();

    assert.strictEqual(tokens[1], 'A');
    assert.strictEqual(tokens[3], '${1:B}');
  });

  test('Does not modify unrelated tokens', () => {
    const inputTokens = ['export', 'type', TYPE_NAME];
    const index = 2;

    const { tokens } = new DeclarationProcessor(
      inputTokens.slice(),
      TYPE_NAME,
      index,
      TAB_ID
    ).process();

    assert.deepStrictEqual(tokens[0], inputTokens[0]);
    assert.deepStrictEqual(tokens[1], inputTokens[1]);
  });
});

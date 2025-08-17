import * as assert from 'assert';
import { createProcessor } from './helper';

const COMPONENT = 'MyComponent';

suite('ImportProcessor', () => {
  test('Replaces default component import with placeholder and tab stop in file path', () => {
    const tokens = ['import', COMPONENT, 'from', "'./MyComponent'"];

    const processor = createProcessor(tokens, COMPONENT, 1);
    const result = processor.process().tokens;

    assert.deepStrictEqual(result, [
      'import',
      '${1:MyComponent}',
      'from',
      "'./$1'",
    ]);
    assert.strictEqual(processor.tabStop.shouldRegister(), true);
  });

  test('Replaces deeply nested default component imports', () => {
    const tokens = ['import', COMPONENT, 'from', "'./ui/MyComponent'"];

    const processor = createProcessor(tokens, COMPONENT, 1);
    const result = processor.process().tokens;

    assert.deepStrictEqual(result[3], "'./ui/$1'");
  });

  test('Skips React default import', () => {
    const tokens = ['import', 'React', 'from', "'react'"];

    const processor = createProcessor(tokens, 'React', 1);
    const result = processor.process().tokens;

    assert.deepStrictEqual(result, tokens);
    assert.strictEqual(processor.tabStop.shouldRegister(), false);
  });

  test('Does not process non-React languages', () => {
    const tokens = ['import', COMPONENT, 'from', "'./MyComponent'"];

    const processor = createProcessor(tokens, COMPONENT, 1, 'typescript');
    const result = processor.process().tokens;

    assert.deepStrictEqual(result, tokens);
    assert.strictEqual(processor.tabStop.shouldRegister(), false);
  });

  test('Does not replace when "from" keyword is missing', () => {
    const tokens = ['import', COMPONENT];

    const processor = createProcessor(tokens, COMPONENT, 1);
    const result = processor.process().tokens;

    assert.deepStrictEqual(result, tokens);
    assert.strictEqual(processor.tabStop.shouldRegister(), false);
  });

  test('Ignores named imports', () => {
    const tokens = ['import', '{', 'useState', '}', 'from', "'react'"];

    const processor = createProcessor(tokens, 'useState', 2);
    const result = processor.process().tokens;

    assert.deepStrictEqual(result, tokens);
    assert.strictEqual(processor.tabStop.shouldRegister(), false);
  });
});

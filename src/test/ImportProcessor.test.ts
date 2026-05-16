import * as assert from 'assert';
import { createProcessor } from './helper';

const COMPONENT = 'MyComponent';

suite('ImportProcessor', () => {
  test('Replaces default component import with placeholder and tab stop in file path', () => {
    const tokens = ['import', COMPONENT, 'from', "'./MyComponent'"];

    const processor = createProcessor(tokens, COMPONENT, 1);
    const { tokens: result, tabStop } = processor.process();

    assert.deepStrictEqual(result, [
      'import',
      '${1:MyComponent}',
      'from',
      "'./$1'",
    ]);
    assert.notStrictEqual(tabStop, null);
  });

  test('Replaces deeply nested default component imports', () => {
    const tokens = ['import', COMPONENT, 'from', "'./ui/MyComponent'"];

    const processor = createProcessor(tokens, COMPONENT, 1);
    const { tokens: result } = processor.process();

    assert.deepStrictEqual(result[3], "'./ui/$1'");
  });

  test('Skips React default import', () => {
    const tokens = ['import', 'React', 'from', "'react'"];

    const processor = createProcessor(tokens, 'React', 1);
    const { tokens: result, tabStop } = processor.process();

    assert.deepStrictEqual(result, tokens);
    assert.strictEqual(tabStop, null);
  });

  test('Processes default imports in non-React languages', () => {
    const tokens = ['import', COMPONENT, 'from', "'./MyComponent'"];

    const processor = createProcessor(tokens, COMPONENT, 1, 'typescript');
    const { tokens: result, tabStop } = processor.process();

    assert.deepStrictEqual(result, [
      'import',
      '${1:MyComponent}',
      'from',
      "'./$1'",
    ]);
    assert.notStrictEqual(tabStop, null);
  });

  test('Does not replace when "from" keyword is missing', () => {
    const tokens = ['import', COMPONENT];

    const processor = createProcessor(tokens, COMPONENT, 1);
    const { tokens: result, tabStop } = processor.process();

    assert.deepStrictEqual(result, tokens);
    assert.strictEqual(tabStop, null);
  });

  test('Does not corrupt file path when component name is a substring of the path', () => {
    const tokens = ['import', 'Button', 'from', "'./ButtonFrom'"];

    const processor = createProcessor(tokens, 'Button', 1);
    const { tokens: result } = processor.process();

    assert.deepStrictEqual(result[3], "'./ButtonFrom'");
  });

  test('Ignores named imports', () => {
    const tokens = ['import', '{', 'useState', '}', 'from', "'react'"];

    const processor = createProcessor(tokens, 'useState', 2);
    const { tokens: result, tabStop } = processor.process();

    assert.deepStrictEqual(result, tokens);
    assert.strictEqual(tabStop, null);
  });
});

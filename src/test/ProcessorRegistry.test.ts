import * as assert from 'assert';
import { ProcessorRegistry } from '../ProcessorRegistry';
import {
  ClassProcessor,
  ConstProcessor,
  DeclarationProcessor,
  FunctionProcessor,
  ImportProcessor,
} from '../Processor';

suite('ProcessorRegistry Test Suite', () => {
  let registry: ProcessorRegistry;

  setup(() => {
    registry = new ProcessorRegistry();
  });

  test('maps "type" to DeclarationProcessor', () => {
    assert.strictEqual(registry.get('type'), DeclarationProcessor);
  });

  test('maps "interface" to DeclarationProcessor', () => {
    assert.strictEqual(registry.get('interface'), DeclarationProcessor);
  });

  test('maps "function" to FunctionProcessor', () => {
    assert.strictEqual(registry.get('function'), FunctionProcessor);
  });

  test('maps "class" to ClassProcessor', () => {
    assert.strictEqual(registry.get('class'), ClassProcessor);
  });

  test('maps "const" to ConstProcessor', () => {
    assert.strictEqual(registry.get('const'), ConstProcessor);
  });

  test('maps "import" to ImportProcessor', () => {
    assert.strictEqual(registry.get('import'), ImportProcessor);
  });

  test('returns undefined for unknown keywords', () => {
    assert.strictEqual(registry.get('let'), undefined);
    assert.strictEqual(registry.get('var'), undefined);
    assert.strictEqual(registry.get(''), undefined);
  });

  test('keywords() returns all registered keywords', () => {
    const keys = registry.keywords();
    assert.deepStrictEqual(
      keys.sort(),
      ['class', 'const', 'function', 'import', 'interface', 'type']
    );
  });
});

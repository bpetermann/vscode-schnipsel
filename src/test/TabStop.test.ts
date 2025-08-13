import * as assert from 'assert';
import { TabStop } from '../TabStop';

suite('TabStop Test Suite', () => {
  test('value returns correct format when id is not null', () => {
    const ts = new TabStop('foo', 1, 2);
    assert.strictEqual(ts.value, '$2');
  });

  test('value returns empty string when id is null', () => {
    const ts = new TabStop('foo', 1, null);
    assert.strictEqual(ts.value, '');
  });

  test('placeholder returns full placeholder format when withPlaceholder is true', () => {
    const ts = new TabStop('bar', 0, 5, true);
    assert.strictEqual(ts.placeholder, '${5:bar}');
  });

  test('placeholder falls back to value when withPlaceholder is false', () => {
    const ts = new TabStop('bar', 0, 5, false);
    assert.strictEqual(ts.placeholder, '$5');
  });

  test('placeholder returns empty string when id is null', () => {
    const ts = new TabStop('baz', 2, null);
    assert.strictEqual(ts.placeholder, '');
  });

  test('index property is preserved as provided', () => {
    const ts = new TabStop('name', 7, 3);
    assert.strictEqual(ts.index, 7);
  });

  test('name property is preserved as provided', () => {
    const ts = new TabStop('originalName', 0, 1);
    assert.strictEqual(ts.name, 'originalName');
  });

  test('placeholder reflects updated name after mutation', () => {
    const ts = new TabStop('original', 0, 1, true);
    ts.name = 'updated';
    assert.strictEqual(ts.placeholder, '${1:updated}');
  });

  test('value reflects updated id after mutation', () => {
    const ts = new TabStop('name', 0, 1, false);
    ts.id = 42;
    assert.strictEqual(ts.value, '$42');
  });
});

import * as assert from 'assert';
import { Parser } from '../Parser';

suite('Parser Test Suite', () => {
  test('Replace function name with tab stop', () => {
    const input = `function foo()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], `function $1()`);
  });

  test('Replace function call with tab stop', () => {
    const input = `function foo() {} 
    foo()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('$1'), true);
  });

  test('Replace interface with tab stop', () => {
    const input = `interface Foo`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('$1'), true);
  });

  test('Replace type alias with tab stop', () => {
    const input = `type Bar = string`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('$1'), true);
  });

  test('Handles multiple constructs and reuse of tab stop', () => {
    const input = `function doWork() {}
    interface Work { id: string }
    type WorkType = 'manual'
    doWork()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('$1'), true);
    assert.strictEqual(body[1].includes('$2'), true);
    assert.strictEqual(body[2].includes('$3'), true);
    assert.strictEqual(body[3].includes('$1'), true);
  });

  test('Handles function names with spacing', () => {
    const input = `function   spacedOut()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('$1'), true);
  });

  test('Preserves blank lines in input', () => {
    const input = `
    function greet() {}
    
    
    
    greet()`;

    const { body } = new Parser(input);

    assert.strictEqual(body.length, 5);
  });

  test('Handles function keyword with no following name', () => {
    const input = `function      `;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], `function`);
  });

  test('Handles spaced interface declaration', () => {
    const input = `interface     MyInterface`;
    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('$1'), true);
  });

  test('Handles type without name gracefully', () => {
    const input = `type`;
    const { body } = new Parser(input);

    assert.strictEqual(body[0], `type`);
  });

  test('Handles multiple tab stops', () => {
    const input = `interface Props {};
    function Foo(props: Props) {};
    Foo()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[2].includes('$2'), true);
  });

  test('Should not replace function names within double-quoted string literals', () => {
    const input = `function MyFunction() {};
    "MyFunction"`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('MyFunction'), true);
  });

  test('Should not replace function names within single-quoted string literals', () => {
    const input = `function MyFunction() {};
    'MyFunction'`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('MyFunction'), true);
  });
});

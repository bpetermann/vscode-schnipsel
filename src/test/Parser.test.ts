import * as assert from 'assert';
import { Parser } from '../Parser';

suite('Parser Test Suite', () => {
  // Function Declarations
  test('Replaces function name with tab stop', () => {
    const input = `function foo()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], `function $1()`);
  });

  test('Handles function names with spacing', () => {
    const input = `function   spacedOut()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('$1'), true);
  });

  test('Handles function keyword with no following name', () => {
    const input = `function      `;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], `function`);
  });

  // Function Calls
  test('Replaces function call with tab stop', () => {
    const input = `function foo() {}
    foo()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('$1'), true);
  });

  // Interfaces & Types
  test('Replaces interface with tab stop', () => {
    const input = `interface Foo`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('$1'), true);
  });

  test('Handles spaced interface declaration', () => {
    const input = `interface     MyInterface`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('$1'), true);
  });

  test('Replaces type alias with tab stop', () => {
    const input = `type Bar = string`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('$1'), true);
  });

  test('Handles type without name gracefully', () => {
    const input = `type`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], input);
  });

  // Class Declarations & Instantiations
  test('Replaces class name with spacing with tab stop', () => {
    const input = `class MyClass {};`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('$1'), true);
  });

  test('Replaces class name without spacing with tab stop', () => {
    const input = `class MyClass{};`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('$1'), true);
  });

  test('Replaces extended class with tab stop', () => {
    const input = `class MyClass extends BaseClass {}`;

    const { body } = new Parser(input);

    assert.ok(body[0].startsWith('class $1 extends'));
  });

  test('Replaces class instantiation with tab stop', () => {
    const input = `class MyClass{};
    new MyClass()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('new $1()'), true);
  });

  // Arrow Functions
  test('Replaces basic arrow function with tab stop', () => {
    const input = `const foo = () => {};`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], 'const $1 = () => {};');
  });

  test('Replaces async arrow function with tab stop', () => {
    const input = `const foo = async () => {};`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], 'const $1 = async () => {};');
  });

  test('Replaces arrow function React component with tab stop', () => {
    const input = `const Foo = (props: Props) => {};`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('$1'), true);
  });

  test('Replaces arrow function despite extra spaces', () => {
    const input = `const   foo   =   () => {}`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('$1'), true);
  });

  // Arrow Function Exclusions
  test('Does not replace const variable declarations with values', () => {
    const input = `const foo = 5`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], input);
  });

  test('Does not replace arrow function with omitted parentheses', () => {
    const input = `const foo = bar => bar + 1`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], input);
  });

  test('Does not replace non-arrow function assigned to const', () => {
    const input = `const foo = function() {};`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], input);
  });

  test('Does not replace non-function async assignment', () => {
    const input = `const foo = asyncValue;`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], input);
  });

  test('Gracefully handles malformed const declaration', () => {
    const input = `const = 5`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], input);
  });

  // Tab Stop Reuse & Multiple Constructs
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

  test('Handles multiple tab stops', () => {
    const input = `interface Props {};
    function Foo(props: Props) {};
    Foo()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[2].includes('$2'), true);
  });

  // Spacing, Formatting & Blank Lines
  test('Preserves blank lines in input', () => {
    const input = `
    function greet() {}
    
    

    greet()`;

    const { body } = new Parser(input);

    assert.strictEqual(body.length, 5);
  });

  // String Literal Safeguards
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

  test('Does not replace substring inside longer function call', () => {
    const input = `function foo() {}
    fooBar()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('fooBar'), true);
    assert.strictEqual(body[1].includes('$1'), false);
  });

  test('Does not replace identifier inside a longer variable', () => {
    const input = `function foo() {}
    const fooExtra = 5;`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('$1'), false);
  });

  test('Replaces matching function name but not similar variables', () => {
    const input = `function fetch() {}
    const fetched = true;
    fetch();`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('fetched'), true);
    assert.strictEqual(body[2].includes('$1'), true);
  });

  test('Replaces identifier followed by colon correctly', () => {
    const input = `function name() {}
    const obj = { name: 'Foo' };`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('$1'), false);
  });

  test('Does not replace identifier used in property access', () => {
    const input = `function name() {}
    user.name = 'John';`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('$1'), false);
  });

  test('Replaces identifier followed by brackets correctly', () => {
    const input = `function render() {}
    render[0]();`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('$1'), false);
  });

  test('Replaces identifier with trailing symbols but not prefixes', () => {
    const input = `function api() {}
    api(); apiEndpoint();`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('$1'), true);
    assert.strictEqual(body[1].includes('apiEndpoint'), true);
  });
});

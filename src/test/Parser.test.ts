import * as assert from 'assert';
import { Parser } from '../Parser';

suite('Parser Test Suite', () => {
  //** Function Declarations */
  test('Replaces function name with tab stop', () => {
    const input = `function foo()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], `function $1()`);
  });

  test('Handles function names with irregular spacing', () => {
    const input = `function   spacedOut()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('$1'), true);
  });

  test('Does not add tab stop when function name is missing', () => {
    const input = `function      `;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], `function`);
  });

  //** Function Calls */
  test('Replaces matching function calls with tab stop', () => {
    const input = `function foo() {}\nfoo()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1], '$1()');
  });

  test('Replaces two matching function calls with tab stop', () => {
    const input = `function foo() {}\nfoo() foo()`;

    const { body } = new Parser(input);

    const tabStopCount = body[1]
      .split(' ')
      .filter((v) => v.includes('$1')).length;

    assert.strictEqual(tabStopCount, 2);
  });

  test('Replaces only the first matching function call if whitespace is omitted', () => {
    const input = `function foo() {}\nfoo()foo()foo()foo()`;

    const { body } = new Parser(input);

    const tabStopCount = body[1]
      .split('()')
      .filter((v) => v.includes('$1')).length;

    assert.strictEqual(tabStopCount, 1);
  });

  //** Class Declarations & Usage */
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

  test('Replaces extended class name with tab stop', () => {
    const input = `class MyClass extends BaseClass {}`;

    const { body } = new Parser(input);

    assert.ok(body[0].startsWith('class $1 extends'));
  });

  test('Replaces class instantiation with tab stop', () => {
    const input = `class MyClass{};\nnew MyClass()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('new $1()'), true);
  });

  //** Interface & Type Declarations */
  test('Replaces interface name with tab stop', () => {
    const input = `interface Foo`;

    const { body } = new Parser(input);
    assert.strictEqual(body[0].includes('interface ${1:Foo}'), true);
  });

  test('Handles spaced interface declaration', () => {
    const input = `interface     MyInterface`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('${1:MyInterface}'), true);
  });

  test('Replaces type alias name with tab stop', () => {
    const input = `type Bar = string`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('${1:Bar}'), true);
  });

  test('Handles malformed type alias with no name gracefully', () => {
    const input = `type`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], input);
  });

  //** Arrow Function Declarations */
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

  test('Replaces arrow function with typed parameters (e.g., React components)', () => {
    const input = `const Foo = (props: Props) => {};`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('$1'), true);
  });

  test('Handles arrow function with excessive spacing', () => {
    const input = `const   foo   =   () => {}`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('$1'), true);
  });

  //** Arrow Function Exclusions */
  test('Does not replace const variable assignments', () => {
    const input = `const foo = 5`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], input);
  });

  test('Does not replace arrow function without parentheses', () => {
    const input = `const foo = bar => bar + 1`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], input);
  });

  test('Does not replace named function expressions', () => {
    const input = `const foo = function() {};`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], input);
  });

  test('Does not replace non-function async assignments', () => {
    const input = `const foo = asyncValue;`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], input);
  });

  test('Handles malformed const declarations gracefully', () => {
    const input = `const = 5`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0], input);
  });

  //** Tab Stop Management & Multiple Constructs */
  test('Correctly increments and reuses tab stops', () => {
    const input = `function doWork() {}\ninterface Work { id: string }\ntype WorkType = 'manual'\ndoWork()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[0].includes('1'), true);
    assert.strictEqual(body[1].includes('2'), true);
    assert.strictEqual(body[2].includes('3'), true);
    assert.strictEqual(body[3].includes('1'), true);
  });

  test('Handles multiple distinct tab stops across lines', () => {
    const input = `interface Props {};\nfunction Foo(props: Props) {};\nFoo()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[2].includes('$2'), true);
  });

  test('Correctly increments tab stop even after multiple unrelated lines', () => {
    const input = `const a = 1;\nconst b = 1;\nconst c = 1;\nconst d = () => {}`;

    const { body } = new Parser(input);

    assert.strictEqual(body[3].includes('$1'), true);
  });

  //** Spacing, Formatting, and Blank Lines */
  test('Preserves blank lines between constructs', () => {
    const input = `\nfunction greet() {}\n\n\n\ngreet()`;

    const { body } = new Parser(input);

    assert.strictEqual(body.length, 5);
  });

  //** Safeguards Against False Positives */
  test('Ignores function names inside double-quoted strings', () => {
    const input = `function MyFunction() {};\n"MyFunction"`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('MyFunction'), true);
  });

  test('Ignores function names inside single-quoted strings', () => {
    const input = `function MyFunction() {};\n'MyFunction'`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('MyFunction'), true);
  });

  test('Does not replace substring in longer identifier (e.g., fooBar)', () => {
    const input = `function foo() {}\nfooBar()`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('fooBar'), true);
    assert.strictEqual(body[1].includes('$1'), false);
  });

  test('Does not replace variable that contains matching identifier', () => {
    const input = `function foo() {}\nconst fooExtra = 5;`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('$1'), false);
  });

  test('Replaces exact function call but not similar variable names', () => {
    const input = `function fetch() {}\nconst fetched = true;\nfetch();`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('fetched'), true);
    assert.strictEqual(body[2].includes('$1'), true);
  });

  test('Does not replace object keys matching identifier', () => {
    const input = `function name() {}\nconst obj = { name: 'Foo' };`;
    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('$1'), false);
  });

  test('Replaces exact identifier but not prefixes like "apiEndpoint"', () => {
    const input = `function api() {}\napi(); apiEndpoint();`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('$1'), true);
    assert.strictEqual(body[1].includes('apiEndpoint'), true);
  });

  test('Replaces identifiers surrounded by non-word characters (e.g., JSX)', () => {
    const input = `function increment() {}\n<button onClick={increment}>Increment</button>`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('$1'), true);
    assert.strictEqual(body[1].includes('Increment'), true);
  });

  //** Placeholder */
  test('Replaces tokens while ignoring placeholders', () => {
    const input = `function Bar(){};\nBar(); type Foo = {};`;

    const { body } = new Parser(input);

    assert.strictEqual(body[1].includes('$1'), true);
    assert.strictEqual(body[1].includes('${2:Foo}'), true);
  });
});

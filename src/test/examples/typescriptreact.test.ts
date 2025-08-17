import * as assert from 'assert';
import { Parser } from '../../Parser';
import { Config } from '../../types';

const config: Config = { placeholder: true };

suite('Typescriptreact Test Suite', () => {
  test('Complete Example', () => {
    const input = `import { useState } from 'react';\ntype CounterProps = {\ninitialCount?: number;\n};\nexport default function Counter({ initialCount = 0 }: CounterProps) {\nconst [count, setCount] = useState(initialCount);\nfunction increment() {\nsetCount(count + 1);\n}\nreturn <button onClick={increment}>Increment</button>;\n}
`;

    const { body } = new Parser(input, config, 'typescriptreact');

    assert.deepStrictEqual(body, [
      "import { useState } from 'react';",
      'type ${1:CounterProps} = {',
      'initialCount?: number;',
      '};',
      'export default function ${2:Counter}({ initialCount = 0 }: $1) {',
      'const [count, setCount] = useState(initialCount);',
      'function ${3:increment}() {',
      'setCount(count + 1);',
      '}',
      'return <button onClick={$3}>Increment</button>;',
      '}',
    ]);
  });
});

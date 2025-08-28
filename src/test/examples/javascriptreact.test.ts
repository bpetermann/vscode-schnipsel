import * as assert from 'assert';
import { Parser } from '../../Parser';
import { Config } from '../../types';

const config: Config = { placeholder: true };

suite('JavaScript React Test Suite', () => {
  test('Complete Example', () => {
    const input = `import { useState } from 'react';\nconst MyComponent = () => {\nconst [count, setCount] = useState(0);\nconst handleClick = () => {\nsetCount(count + 1);\n};\nreturn <button onClick={handleClick}>Click</button>;\n};
`;
    const { body } = new Parser(input, config, 'javascriptreact');

    assert.deepStrictEqual(body, [
      "import { useState } from 'react';",
      'const ${1:MyComponent} = () => {',
      'const [count, setCount] = useState(0);',
      'const ${2:handleClick} = () => {',
      'setCount(count + 1);',
      '};',
      'return <button onClick={$2}>Click</button>;',
      '};',
    ]);
  });
});

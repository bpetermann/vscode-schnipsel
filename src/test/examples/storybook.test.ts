import * as assert from 'assert';
import { Parser } from '../../Parser';
import { Config } from '../../types';

const config: Config = { placeholder: true };

suite('Storybook Test Suite', () => {
  test('Complete Example', () => {
    const input = `import { Meta, StoryObj } from '@storybook/nextjs';\nimport Button from './Button';\nconst meta: Meta<typeof Button> = {\ncomponent: Button,\nargs: {\ntype: 'primary',\nlabel: 'Button',\n},\nargTypes: {},\n} satisfies Meta<typeof Button>;\nexport default meta;\ntype Story = StoryObj<typeof meta>;\nexport const Primary: Story = {};`;

    const { body } = new Parser(input, config, 'typescriptreact');

    assert.deepStrictEqual(body, [
      "import { Meta, StoryObj } from '@storybook/nextjs';",
      "import ${1:Button} from './$1';",
      'const meta: Meta<typeof $1> = {',
      'component: $1,',
      'args: {',
      "type: 'primary',",
      "label: '$1',",
      '},',
      'argTypes: {},',
      '} satisfies Meta<typeof $1>;',
      'export default meta;',
      'type ${2:Story} = StoryObj<typeof meta>;',
      'export const Primary: $2 = {};',
    ]);
  });
});

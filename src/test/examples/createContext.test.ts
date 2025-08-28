import * as assert from 'assert';
import { Parser } from '../../Parser';
import { Config } from '../../types';

const config: Config = { placeholder: true };

suite('CreateContext Test Suite', () => {
  test('Complete Example', () => {
    const input = `import { createContext, type ReactNode, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme} (click to toggle)
    </button>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemeButton />
    </ThemeProvider>
  );
}`;

    const { body } = new Parser(input, config, 'typescriptreact');

    assert.deepStrictEqual(body, [
      "import { createContext, type ${1:ReactNode,} useContext, useState } from 'react';",
      '',
      "type ${2:Theme} = 'light' | 'dark';",
      '',
      'interface ${3:ThemeContextValue} {',
      '  theme: $2;',
      '  toggleTheme: () => void;',
      '}',
      '',
      'const ${4:ThemeContext} = createContext<$3 | undefined>(undefined);',
      'export function ${5:ThemeProvider}({ children }: { children: ReactNode }) {',
      "  const [theme, setTheme] = useState<$2>('light');",
      '',
      '  const ${6:toggleTheme} = () => {',
      "    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));",
      '  };',
      '  return (',
      '    <$4.Provider value={{ theme, $6 }}>',
      '      {children}',
      '    </$4.Provider>',
      '  );',
      '}',
      '',
      '// eslint-disable-next-line react-refresh/only-export-components',
      'export function ${7:useTheme}() {',
      '  const context = useContext($4);',
      '  if (!context) {',
      "    throw new Error('$7 must be used within a $5');",
      '  }',
      '  return context;',
      '}',
      '',
      'function ${8:ThemeButton}() {',
      '  const { theme, $6 } = $7();',
      '  return (',
      '    <button onClick={$6}>',
      '      Current theme: {theme} (click to toggle)',
      '    </button>',
      '  );',
      '}',
      '',
      'export default function ${9:App}() {',
      '  return (',
      '    <$5>',
      '      <$8 />',
      '    </$5>',
      '  );',
      '}',
    ]);
  });
});

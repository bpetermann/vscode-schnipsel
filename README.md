# Schnipsel

![Visual Studio Marketplace Downloads] ![Visual Studio Marketplace Version]

**Schnipsel** – Snippet generation made easy!

This extension adds the command **Copy Code as Snippet** to your Command Palette. When run, it converts the selected code, or the entire file if nothing is selected, into a ready-to-use VS Code snippet and copies it to your clipboard.

## Features

- **Command Integration**: Adds `Copy Code as Snippet` to the Command Palette.
- **Intelligent Snippet Generation**: Converts code into a snippet while preserving spacing and indentation.
- **Smart Tab Stops**: Replaces key symbols like function names, interfaces, and types with tab stops for quick editing.

## Usage

1. **Select your code**: Highlight the code you want to convert. (If no selection is made, the entire file is used.)
2. **Run the command**: Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and search for `Copy Code as Snippet`.
3. **Paste your snippet**: A success message appears. Click `Open` to jump to your snippets file and paste it in.
4. **Customize**: Edit the snippet’s name, prefix, or body if needed.
5. **Done!** Your snippet is ready to use.

## Requirements & Supported Languages

Currently supports:

- `typescriptreact`
- `javascriptreact`
- `javascript`
- `typescript`

## Requirements

No additional setup required. Works out of the box with VS Code’s built-in snippet system.

> **Note**: While not required, this extension works best when your code is well-formatted and free of syntax errors. Using a code formatter like **Prettier** and a linter like **ESLint** is highly recommended to ensure the most predictable and accurate results.

## Release Notes

**v1.0.1**

- Fix readme demo.gif

**v1.0.0**

- Initial release
- Adds the `Copy Code as Snippet` command
- Generates intelligent snippets with automatic tab stops
- Supports TS, JS, JSX, and TSX files

## Code Example

**Input Code:**

```jsx
import { useState } from 'react';

type CounterProps = {
  initialCount?: number,
};

export default function Counter({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  function increment() {
    setCount(count + 1);
  }

  return <button onClick={increment}>Increment</button>;
}
```

**Generated Snippet:**

```json
{
  "Snippet from Counter": {
    "prefix": "Counter",
    "body": [
      "import { useState } from 'react';",
      "",
      "type $1 = {",
      "  initialCount?: number;",
      "};",
      "",
      "export default function $2({ initialCount = 0 }: $1) {",
      "  const [count, setCount] = useState(initialCount);",
      "",
      "  function $3() {",
      "    setCount(count + 1);",
      "  }",
      "",
      "  return <button onClick={$3}>Increment</button>;",
      "}"
    ],
    "description": "Auto-generated typescriptreact snippet from Counter"
  }
}
```

## Usage Examples

![Demo](https://raw.githubusercontent.com/bpetermann/vscode-schnipsel/main/resources/demo.gif)

## Contributing

Contributions are welcome! Feel free to open an issue or pull request on [GitHub](https://github.com/bpetermann/vscode-schnipsel).

## Changelog

To check full changelog click [here](https://github.com/bpetermann/vscode-schnipsel/blob/main/CHANGELOG.md)

## License

[MIT](https://github.com/bpetermann/vscode-schnipsel/blob/main/LICENSE)

## Enjoy!

Happy coding, and may your snippets always be sharp. ✂️

[Visual Studio Marketplace Downloads]: https://img.shields.io/visual-studio-marketplace/d/bpetermann.schnipsel
[Visual Studio Marketplace Version]: https://img.shields.io/visual-studio-marketplace/v/bpetermann.schnipsel

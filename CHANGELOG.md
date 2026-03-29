# Change Log

All notable changes to the "schnipsel" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

### Fixed

- Fix import path corruption when component name is a substring of the file path (e.g. `Button` from `'./ButtonFrom'`)
- Fix identifier replacement failing for names containing regex special characters (e.g. `state$`)
- Fix snippet body corruption when input uses Windows line endings (CRLF)
- Fix duplicate declaration names producing nested tab stops (e.g. `${2:$1}`) instead of reusing the existing tab stop
- Fix parenthesized expression assignments (e.g. `const x = (a + b)`) incorrectly receiving a tab stop
- Fix default imports not being processed in non-React languages (`typescript`, `javascript`)
- Fix identifier replacement incorrectly triggering inside compact object literals (e.g. `{foo:'bar'}`)

## [1.3.0] - 2026-03-29

### Added

- Replace constants assigned with `createContext`, `forwardRef`, or `lazy` with tab stops in React files

## [1.2.0] - 2025-08-25

### Added

- Option to configure between `TabStop` and `Placeholder`
- Replace default component import in `javascriptreact` and `typescriptreact`

### Changed

- Changed default keyword replacement to `Placeholder`

## [1.1.0] - 2025-08-07

### Added

- Replace `class` name declarations with tab stops
- Replace arrow function declarations with tab stops

### Fixed

- Fix tab stop replacement logic to match whole identifiers only

## [1.0.1] - 2025-07-31

### Fixed

- Fix readme demo.gif

## [1.0.0] - 2025-07-31

### Added

- Initial release
- Adds the `Copy Code as Snippet` command
- Generates intelligent snippets with automatic tab stops
- Supports TS, JS, JSX, and TSX files

[1.0.0]: https://github.com/bpetermann/vscode-schnipsel/releases/tag/v1.0.0
[1.2.0]: https://github.com/bpetermann/vscode-schnipsel/releases/tag/v1.2.0

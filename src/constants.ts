/** COMMAND */
export const EXTENSION = 'schnipsel' as const;
export const COMMAND = 'schnipsel.copyCodeAsSnippet' as const;
export const OPEN_SNIPPETS = 'workbench.action.openSnippets' as const;
export const PLACEHOLDER = 'placeholder' as const;

/** MESSAGES */
export const MESSAGES = {
  MISSING_EDITOR: 'No active editor.',
  NOT_SUPPORTED: 'Currently not supported.',
  SUCCESS: 'Snippet copied! You can now paste it into your snippets file.',
  FAIL: 'Failed to copy code to clipboard.',
  OPEN: 'Open snippet file',
  Dismiss: 'Dismiss',
  ERROR: 'Failed to copy snippet:',
} as const;

/** SNIPPET */
export const SNIPPET = {
  NAME: 'Snippet from',
} as const;

/** SUPPORTED_LANGUAGES */
export const SUPPORTED_LANGUAGES = [
  'typescriptreact',
  'javascriptreact',
  'javascript',
  'typescript',
];

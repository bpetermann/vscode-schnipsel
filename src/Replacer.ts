/**
 * Performs identifier-to-tab-stop substitution on a tokenized line of source code.
 *
 * For each identifier present as a key in `tabStopMap` (e.g., a declared function,
 * class, interface, or type name), this class replaces whole-word occurrences of
 * that identifier in the `tokens` array with the mapped tab-stop text (e.g. `$1`).
 */
export class TabStopReplacer {
  /**
   * @param tokens - The tokenized source code as an array of strings.
   * @param tabStopMap - A map where the key is a tab stop identifier (e.g., `$1`)
   * and the value is the snippet placeholder or value to replace it with.
   */
  constructor(
    private readonly tokens: string[],
    private readonly tabStopMap: Map<string, string>
  ) {}

  /**
   * Replaces tab stops in the token array with their mapped values.
   */
  public apply(): string[] {
    return this.tokens.map((token) => {
      for (const [tabStop, value] of this.tabStopMap) {
        if (
          this.isWholeWordMatch(token, tabStop) &&
          !this.isObjectPropertyKey(token) &&
          !this.isStringLiteral(token)
        ) {
          return token.replace(tabStop, value);
        }
      }
      return token;
    });
  }

  /**
   * Checks whether `token` contains `identifier` as a whole word according to JS regex
   * word-boundary semantics (i.e., boundaries between `\w` and `\W`).

   */
  private isWholeWordMatch(token: string, identifier: string): boolean {
    return new RegExp(`\\b${identifier}\\b`).test(token);
  }

  /**
   * Determines whether the token represents an object property key
   * (e.g., `"foo:"`), in which case a tab stop should not be replaced.
   */
  private isObjectPropertyKey(item: string): boolean {
    return item.endsWith(':');
  }

  /**
   * Checks if the token is a string literal (single-quoted or double-quoted),
   * in which case a tab stop should not be replaced.
   */
  private isStringLiteral(item: string): item is `"${string}"` | `'${string}'` {
    return (
      (item.startsWith("'") && item.endsWith("'")) ||
      (item.startsWith('"') && item.endsWith('"'))
    );
  }
}

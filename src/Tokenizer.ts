export function tokenize(line: string): string[] {
  const parts = line.split(' ');
  const firstContent = parts.findIndex((t) => t !== '');
  if (firstContent === -1) {
    return [];
  }
  const leading = parts.slice(0, firstContent);
  const rest = parts.slice(firstContent).filter((t) => t !== '');
  return [...leading, ...rest];
}

export function join(tokens: string[]): string {
  return tokens.join(' ');
}

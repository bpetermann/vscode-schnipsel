import { Snippet } from './Snippet';

export class Parser {
  constructor(private readonly input: string) {}

  parse(): string {
    return new Snippet(
      'name',
      'prefix',
      this.input.split('\n'),
      'description'
    ).toString();
  }
}

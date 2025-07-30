import assert from 'assert';
import { Snippet } from '../Snippet';
import { SNIPPET } from '../constants';

suite('Snippet Test Suite', () => {
  test('toString returns valid snippet JSON', () => {
    const body: string[] = [];
    const languageId = 'typescriptreact';
    const fileName = 'Component';

    const snippet = new Snippet(body, languageId, fileName);
    const result = snippet.toString();

    const parsed = JSON.parse(`{${result}}`);

    const expectedKey = `${SNIPPET.NAME} ${fileName}`;

    assert.deepStrictEqual(parsed, {
      [expectedKey]: {
        prefix: fileName,
        body,
        description: `Auto-generated ${languageId} snippet from ${fileName}`,
      },
    });
  });
});

import assert from 'assert';
import { Snippet } from '../Snippet';
import { SNIPPET } from '../constants';

suite('Snippet Test Suite', () => {
  const body: string[] = ['const ${1:foo} = $1;'];
  const languageId = 'typescriptreact';
  const fileName = 'Component';
  const expectedKey = `${SNIPPET.NAME} ${fileName}`;
  const expectedObject = {
    [expectedKey]: {
      prefix: fileName,
      body,
      description: `Auto-generated ${languageId} snippet from ${fileName}`,
    },
  };

  test('toString output is an embeddable JSON fragment (no outer braces)', () => {
    const snippet = new Snippet(body, languageId, fileName);
    const result = snippet.toString();

    // Lock down exact format: wrapping in {} must produce valid snippet JSON.
    assert.strictEqual(`{${result}}`, JSON.stringify(expectedObject, null, 2));
  });

  test('toString output parses to correct snippet structure', () => {
    const snippet = new Snippet(body, languageId, fileName);
    const result = snippet.toString();

    assert.deepStrictEqual(JSON.parse(`{${result}}`), expectedObject);
  });
});

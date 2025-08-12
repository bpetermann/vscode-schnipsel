import path from 'path';
import * as sinon from 'sinon';
import { ExtensionContext, window } from 'vscode';
import { Parser } from '../Parser';
import { Service } from '../Service';
import { Snippet } from '../Snippet';

suite('Service Test Suite', () => {
  let activeEditorStub: sinon.SinonStub;
  let showErrorStub: sinon.SinonStub;
  let showInfoStub: sinon.SinonStub;

  const parseFactory = (text: string): Parser =>
    new Parser(text, { placeholder: true });
  const snippetFactory = (
    body: string[],
    language: string,
    name: string
  ): Snippet => new Snippet(body, language, name);

  setup(() => {
    showInfoStub = sinon.stub(window, 'showInformationMessage').resolves();
    showErrorStub = sinon.stub(window, 'showErrorMessage').resolves();
    activeEditorStub = sinon.stub(window, 'activeTextEditor');

    sinon.stub(path, 'parse').returns({
      root: '',
      dir: '',
      base: '',
      ext: '',
      name: 'fileName',
    });
  });

  teardown(() => sinon.restore());

  test('Shows info after successful copy', async () => {
    activeEditorStub.get(() => ({
      document: {
        getText: () => '',
        languageId: 'typescript',
        uri: { fsPath: '' },
      },
    }));

    await new Service(
      {} as ExtensionContext,
      parseFactory,
      snippetFactory
    ).copyCodeAsSnippet();

    sinon.assert.calledOnce(showInfoStub);
  });

  test('Shows error if no active editor', async () => {
    await new Service(
      {} as ExtensionContext,
      parseFactory,
      snippetFactory
    ).copyCodeAsSnippet();

    sinon.assert.calledOnce(showErrorStub);
  });

  test('Shows error if no language support', async () => {
    activeEditorStub.get(() => ({
      document: { getText: () => '' },
    }));

    await new Service(
      {} as ExtensionContext,
      parseFactory,
      snippetFactory
    ).copyCodeAsSnippet();

    sinon.assert.calledOnce(showErrorStub);
  });
});

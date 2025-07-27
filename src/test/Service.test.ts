import * as sinon from 'sinon';
import { ExtensionContext, window } from 'vscode';
import { Service } from '../extension';

suite('Service Test Suite', () => {
  let activeEditorStub: sinon.SinonStub;
  let showErrorStub: sinon.SinonStub;
  let showInfoStub: sinon.SinonStub;

  setup(() => {
    showInfoStub = sinon.stub(window, 'showInformationMessage').resolves();
    showErrorStub = sinon.stub(window, 'showErrorMessage').resolves();
    activeEditorStub = sinon.stub(window, 'activeTextEditor');
  });

  teardown(() => sinon.restore());

  test('Shows info after successful copy', async () => {
    activeEditorStub.get(() => ({ document: { getText: () => '' } }));

    await new Service({} as ExtensionContext).copy();

    sinon.assert.calledOnce(showInfoStub);
  });

  test('Shows error if no active editor', async () => {
    await new Service({} as ExtensionContext).copy();

    sinon.assert.calledOnce(showErrorStub);
  });
});

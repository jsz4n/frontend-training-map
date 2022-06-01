import { module, test } from 'qunit';
import { setupTest } from 'simple-front/tests/helpers';

module('Unit | Model | city', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('city', {});
    assert.ok(model);
  });
});

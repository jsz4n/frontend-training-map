import { module, test } from 'qunit';
import { setupTest } from 'simple-front/tests/helpers';

module('Unit | Transform | phone', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let transform = this.owner.lookup('transform:phone');
    assert.ok(transform);
  });
});

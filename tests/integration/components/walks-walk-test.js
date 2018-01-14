import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('walks-walk', 'Integration | Component | walks walk', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{walks-walk}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#walks-walk}}
      template block text
    {{/walks-walk}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

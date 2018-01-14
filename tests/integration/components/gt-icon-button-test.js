import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gt-icon-button', 'Integration | Component | gt icon button', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{gt-icon-button}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#gt-icon-button}}
      template block text
    {{/gt-icon-button}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

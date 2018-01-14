import Ember from 'ember';
import Turf from 'npm:turf';

export default Ember.Component.extend({
  classNames: ['walks-walk'],
  attributeBindings: ['order:style'],

  walk: null,
  location: null,

  distance: Ember.computed('location', function() {
    let distance = Turf.distance(
      this.get('walk').geocenter, this.get('location')
    );
    return Math.round(distance * 10) / 10;
  }),

  order: Ember.computed('distance', function() {
    let order = this.get('distance') * 10;
    return Ember.String.htmlSafe(`order: ${order}`);
  })
});

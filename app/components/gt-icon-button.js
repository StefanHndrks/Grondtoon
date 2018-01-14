import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'i',
  classNames: ['material-icons'],

  property: false,

  click() {
    this.toggleProperty('property');
  }
});

import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['gt-overlay'],
  classNameBindings: ['open'],

  open: false,

  click() {
    this.set('open', false);
  }
});

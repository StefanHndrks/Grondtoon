import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['gt-menu'],
  classNameBindings: ['open'],

  open: false,

  click() {
    Ember.run.later(this, function() {
      this.set('open', false);
    }, 300);
  }
});

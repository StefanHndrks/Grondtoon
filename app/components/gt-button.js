import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['gt-button'],

  click() {
    console.log('click');
  }
});

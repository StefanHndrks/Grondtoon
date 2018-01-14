import Ember from 'ember';

export default Ember.Route.extend({
  walkhandler: Ember.inject.service(),

  beforeModel() {
    if (window.location.protocol !== "https:") {
      window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
    }

    this.transitionTo('/');
  },

  model() {
    return Ember.RSVP.hash({
      walkhandler: this.get('walkhandler')
    });
  }
});

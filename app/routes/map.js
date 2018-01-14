import Ember from 'ember';

export default Ember.Route.extend({
  geohandler: Ember.inject.service(),
  walkhandler: Ember.inject.service(),

  model() {
    return Ember.RSVP.hash({
      geohandler: this.get('geohandler'),
      walkhandler: this.get('walkhandler')
    });
  }
});

import Ember from 'ember';
import Turf from 'npm:turf';

export default Ember.Route.extend({
  geohandler: Ember.inject.service(),

  model() {
    return Ember.RSVP.hash({
      geohandler: this.get('geohandler'),

      walks: new Ember.RSVP.Promise(function(resolve) {
        Ember.$.getJSON("assets/walks.json" , function(result) {
          resolve(result.sortBy('walkname'));
        }.bind(this));
      }.bind(this)),

      // location: this.get('geohandler').get('point'),
      location: Ember.computed(
        'geohandler.longitude',
        'geohandler.latitude',
        function() {
          return Turf.point([
            this.get('geohandler').longitude,
            this.get('geohandler').latitude
          ]);
        }.bind(this)
      )
    });
  }
});

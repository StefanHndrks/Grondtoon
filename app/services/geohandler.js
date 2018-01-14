import Ember from 'ember';
// import Turf from 'npm:turf';

export default Ember.Service.extend(Ember.Evented, {
  routing: Ember.inject.service('-routing'),

  longitude: 5.121694207191467,
  latitude:  52.09075984798269,
  accuracy:  5,

  onceReceived: false,

  // point: Ember.computed('longitude', 'latitude', function() {
  //   return Turf.point([this.get('longitude'), this.get('latitude')]);
  // }),

  init() {
    this._super(...arguments);

    // this.get('longitude');
    // this.get('latitude');

    navigator.geolocation.watchPosition((geoObject) => {
      this.set('latitude' , geoObject.coords.latitude);
      this.set('longitude', geoObject.coords.longitude);
      this.set('accuracy' , geoObject.coords.accuracy);
      this.trigger('geolocationSuccess', geoObject);
    }, (reason) => {
      this.trigger('geolocationFail', reason);
      this.get('routing').transitionTo('error');
    }, {
      maximumAge: 0,
      timeout: Infinity,
      enableHighAccuracy: true
    });
  }
});

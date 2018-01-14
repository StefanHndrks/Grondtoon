import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  geohandler: Ember.inject.service(),

  weatherData: null,
  pollInterval: 300000,

  // clear-day, clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day, partly-cloudy-night
  mainWeather: Ember.computed('weatherData', function() {
    return this.get('weatherData').currently.icon;
  }),

  createRoute() {
    let lat = this.get('geohandler').latitude;
    let lon = this.get('geohandler').longitude;
    return `https://api.forecast.io/forecast/APIKEY/${lat},${lon}`;
  },

  onPoll() {
    let route = this.createRoute();
    Ember.$.ajax({
      url: route,
      dataType: "jsonp",
      success: function(data) {
        this.set('weatherData', data);

        this.trigger('weatherEvent');
      }.bind(this)
    });
  },

  // Starts the pollster, i.e. executes the `onPoll` function every interval.
  start() {
    this.set('timer', this.schedule(this.get('onPoll')));
  },

  // Stops the pollster
  stop() {
    Ember.run.cancel(this.get('timer'));
  },

  // Schedules the function `f` to be executed every `interval` time.
  schedule(f) {
    return Ember.run.later(this, function() {
      f.apply(this);
      this.set('timer', this.schedule(f));
    }, this.get('pollInterval'));
  },

  init() {
    this._super(...arguments);

    let geohandler = this.get('geohandler');
    if (geohandler.get('onceReceived')) {
      this.onPoll();
    } else {
      geohandler.one('geolocationSuccess', this, function() {
        this.onPoll();
      });
    }
  }
});

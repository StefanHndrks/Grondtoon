import Ember from 'ember';
import Turf from 'npm:turf';

export default Ember.Service.extend({
  geohandler: Ember.inject.service(),
  weatherhandler: Ember.inject.service(),
  audiohandler: Ember.inject.service(),

  selected: null,
  namespace: Ember.computed('selected', function() {
    return `assets/walks/${this.get('selected')}`;
  }),

  loading: false,
  loaded: false,

  walk: null,

  tmpOutsideGlob: {
    name: "tmpOutsideGlob",
    namespace: 'assets/walks/Rondom de Dom',
    // namespace: 'assets/walks/Test in Delft',
    tracks: Ember.A(),
  },

  _onSelected: Ember.observer('selected', function() {
    this.set('loading', true);
    this.set('loaded', false);

    this._stopAudio();
    this.set('walk', null);

    // get walk data
    Ember.$.getJSON(
      `${this.get('namespace')}/${this.get('selected')}.json`,
      function(result) {
        let namespace = this.get('namespace');

        // to do: make the walk data load ready
        result.forEach(function(area) {
          // create geoJSON polygons from the points
          let points = Ember.A();
          area.points.forEach(function(point) {
            points.push(Ember.A([point.lng, point.lat]));
          });
          points.push(points[0]);
          area.polygon = Turf.polygon([points]);
          // save namespace for audioload in audioplayer
          area.namespace = namespace;

          area.tracks.forEach(function(track) {
            // set decay and attack
            if (!track.attack) {track.attack = area.attack;}
            if (!track.decay) {track.decay = area.decay;}
            track.attack = Number(track.attack);
            track.decay = Number(track.decay);
            // make weather track disabled (till a weather event)
            if (track.weather.length > 0) {
              track.disabled = true;
              track.weather.forEach(function(weather) {
                if (weather.id === "clear-day") {
                  track.disabled = false;
                }
              });
            }
            if (!track.inside) {
              this.get('tmpOutsideGlob').tracks.push(Ember.Object.create(track));

              track.disabled = true;
            }
          }.bind(this));
        }.bind(this));

        this.get('weatherhandler').start();
        // set walk data
        // console.log(result);
        this.set('walk', result);

        this.set('loading', false);
        this.set('loaded', true);
      }.bind(this)
    ).error(function() {
      // error
    }).complete(function() {
      // complete
    });

    // console.log(`walkhandler: ${this.get('selected')}`);
  }),

  _stopAudio() {
    let walk = this.get('walk');
    if (walk) {
      walk.forEach(function(area) {
        let audiohandler = this.get('audiohandler');

        if (audiohandler.echoes[area.name]) {
          audiohandler.echoes[area.name].stop();
        }
      }.bind(this));
    }
  },

  init() {
    this._super(...arguments);

    this.subscribeGeohandler();
    this.subscribeWeatherhandler();
  },

  subscribeGeohandler() {
    this.get('geohandler').on('geolocationSuccess', this, function() {
      let walk = this.get('walk');
      if (walk) {
        let geohandler = this.get('geohandler');
        let audiohandler = this.get('audiohandler');

        let point = Turf.point(
          [geohandler.get('longitude'), geohandler.get('latitude')]
        );

        walk.forEach(function(area) {
          if (Turf.inside(point, area.polygon)) {
            console.log(area.name);
            if (audiohandler.echoes[area.name]) {
              audiohandler.echoes[area.name].start();
            } else {
              audiohandler.createEcho(area);
              audiohandler.echoes[area.name].start();
            }
            if (area.name === "global") {
              console.log('stop:');
              let glob = this.get('tmpOutsideGlob');
              if (audiohandler.echoes[glob.name]) {
                audiohandler.echoes[glob.name].stop();
              }
              // console.log(this.get('tmpOutsideGlob'));
            }
          } else {
            if (audiohandler.echoes[area.name]) {
              audiohandler.echoes[area.name].stop();
            }
            if (area.name === "global") {
              console.log('start:');
              let glob = this.get('tmpOutsideGlob');
              if (audiohandler.echoes[glob.name]) {
                audiohandler.echoes[glob.name].start();
              } else {
                audiohandler.createEcho(glob);
                audiohandler.echoes[glob.name].start();
              }
              console.log(this.get('tmpOutsideGlob'));
            }
          }
        }.bind(this));
      }
    });
  },

  subscribeWeatherhandler() {
    this.get('weatherhandler').on('weatherEvent', this, function() {
      let weather = this.get('weatherhandler.mainWeather');
      this.get('audiohandler').updateWeather(weather);
    });
  }
});

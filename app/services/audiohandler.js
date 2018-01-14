import Ember from 'ember';

const EchoNode = Ember.Object.extend(Ember.Evented, {
  playing: false,

  init() {
    // this.set('playing', false);

    // this.get('tracks').forEach(function(track) {
    //   switch(track.type) {
    //     case "sample":
    //       this._createSource(track);
    //       break;
    //     case "timed":
    //       console.log('WARNING: unimplemented type');
    //       this._createSource(track);
    //       break;
    //     default:
    //       console.log('ERROR: unkown type');
    //   }
    // }.bind(this));
  },

  start() {
    this.get('tracks').forEach(function(track) {
      if (!track.get('disabled')) {
        //
        if (!track.get('playing')) {
          track.set('playing', true);

          this._startTrack(track);
        }
      }
    }.bind(this));
  },

  _startTrack(track) {
    // check loaded
    if (track.get('loaded')) {
      // Start audio
      if (!Ember.run.cancel(track.get('stopEvent'))) {
        try {
          track.get('source').noteOn(0);
        } catch(e) {
          track.get('source').start(0);
        }
      }
      // fade audio in
      Ember.$(track.get('gainNode').gain).stop().animate(
        {value: 1}, track.get('attack'), 'swing'
      );
    } else {
      if (!this.get('loading')) {
        // start loading
        this._createSource(track);
      }
      // subscribe for onloaded event
      track.one('loaded', this, function() {
        this._startTrack(track);
      });
    }
  },

  stop() {
    this.get('tracks').forEach(function(track) {
      if (track.get('playing')) {
        track.set('playing', false);

        // cancel subscriptions
        track.off('loaded');
        // fade audio out
        Ember.$(track.get('gainNode').gain).stop().animate(
          {value: 0}, track.get('decay'), 'swing'
        );
        // Stop audio
        track.set('stopEvent', Ember.run.later(function() {
          try {
            track.get('source').noteOff(0);
          } catch(e) {
            track.get('source').stop(0);
          }
        }, track.get('decay')));
      // this.trigger('tracksStopped');
      }
    });
  },

  _createSource(track) {
    let context = this.get('context');

    track.set('source', context.createBufferSource());

    track.get('source').loop = track.loop;
    track.get('source').onended = function() {
      this._createSource(track);
    }.bind(this);

    // create gain node if there is none
    if (!track.get('gainNode')) {
      track.set('gainNode', context.createGain());
      track.get('gainNode').gain.value = 0;
      track.get('gainNode').connect(context.destination);
    }

    // load buffer if there is none
    if (!track.get('buffer')) {
      track.set('loading', true);

      let request = new XMLHttpRequest();
      let namespace = this.get('namespace');
      let audio = track.get('audio');
      request.open('GET', `${namespace}/${audio}.mp3`, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {
        context.decodeAudioData(request.response, buffer => {
          track.set('buffer', buffer);
          track.get('source').buffer = buffer;
          // trigger loaded event
          track.set('loaded', true);
          track.set('loading', false);
          track.trigger('loaded');
        });
      };
      request.onerror = function() {
        // trigger loaded event
        track.set('loaded', true);
        track.set('loading', false);
        track.trigger('loaded');
      };
      request.send();
    } else {
      track.get('source').buffer = track.buffer;
    }
    track.get('source').connect(track.get('gainNode'));
  }
});

const NodeTrack = Ember.Object.extend(Ember.Evented, {
  disabled: false,
  playing: false,
  loaded: false,
  loading: false
});

export default Ember.Service.extend({
  context: null,
  echoes: {},

  init() {
    this._super(...arguments);

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.set('context', new AudioContext());
    } catch(e) {
      console.log('Web Audio API is not supported in this browser');
    }
  },

  enableAudio() {
    // create empty buffer
    let context = this.get('context');
    let buffer = context.createBuffer(1, 1, 22050);
	  let source = context.createBufferSource();
    source.buffer = buffer;

    // connect to output (your speakers)
    source.connect(context.destination);

    // play the file
    try {
      source.noteOn(0);
    } catch(e) {
      source.start(0);
    }
  },

  createEcho(echo) {
    let tracks = Ember.A([]);
    echo.tracks.forEach(function(track) {
      tracks.push(NodeTrack.create(track));
    });

    let echoNode = EchoNode.create({
      context: this.get('context'),
      name: echo.name,
      namespace: echo.namespace,
      tracks: tracks
    });

    this.get('echoes')[echo.name] = echoNode;
  },

  destroyEcho(name) {
    let echoNode = this.get('echoes')[name];
    this.get('echoes')[name] = null;
    echoNode.destroy();
  },

  updateWeather(weather) {
    console.log(weather);
  }
});

import Ember from 'ember';

export default Ember.Controller.extend({
  audiohandler: Ember.inject.service(),

  actions: {
    enableAudio() {
      this.get('audiohandler').enableAudio();
    }
  }
});

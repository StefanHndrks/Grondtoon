import Ember from 'ember';

export default Ember.Controller.extend({
  walkhandler: Ember.inject.service(),

  actions: {
    select(walkname, creator, creatorLink) {
      Ember.run.later(this, function() {
        this.transitionToRoute('map');
      }, 500);
      this.get('walkhandler').set('selected', walkname);
      this.get('walkhandler').set('creator', creator);
      this.get('walkhandler').set('creatorLink', creatorLink);
    }
  }
});

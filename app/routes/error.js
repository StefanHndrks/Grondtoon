import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
   reload: function(){
     window.location.reload(false);
     //get some new model
    //  this.transitionTo('/', newModel);
   }
 }
});

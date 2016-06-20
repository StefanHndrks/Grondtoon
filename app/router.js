import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('map');
  this.route('walks');
  this.route('guide', function() {
    this.route('settings');
    this.route('headphones');
  });
  this.route('about');
  this.route('error');
});

export default Router;

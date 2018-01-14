import Ember from 'ember';
import Turf from 'npm:turf';

export default Ember.Service.extend({
  geohandler: Ember.inject.service(),
  units: 'kilometers',

  distance(geojsonPoint) {
    let location = Turf.point([
      this.get('geohandler').longitude,
      this.get('geohandler').latitude
    ]);
    return Turf.distance(geojsonPoint, location, this.get('units'));
  }
});

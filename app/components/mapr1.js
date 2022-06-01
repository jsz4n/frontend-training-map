import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import Point from 'ol/geom/Point';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { Attribution, defaults as defaultControls } from 'ol/control';

//TODO: Add openlayer here
export default class Mapr1Component extends Component {
  @service store;
  needsToLoad = true;
  regionMap = undefined;
  cities = [];
  osmLayer =new TileLayer({ source: new OSM() });
  vectorLayer;
  


  @action 
  updateCities(newCities){
      console.log(newCities);
      this.store.query('city',
               {name:newCities}
      ).then(cities => {
          this.cities={ type:"FeatureCollection", features:
              cities.map( city =>
              ({type:"Feature",geometry:{type:"Point", coordinates:[city.lat, city.long]}, properties:{name:city.name} })
          )
          };
      }).then(_ => this.updateMap());
  }
  
  updateMap(){
      console.log(this.cities);
      this.initMap()
      this.vectorLayer=  new VectorLayer({source:this.cities});
  }
  /**
   * it should load a first map
   * should use ember-modifier to create the listener
   */
  @action
  initMap() {
    if (this.needsToLoad) {
      const attribution = new Attribution({
        collapsible: true,
        collapsed: true,
      });
      if (!this.regionMap) {
        this.regionMap = new Map({
          layers: [this.osmLayer],
          target: 'map',
          view: new View({
            center: fromLonLat([3.956461, 51.010871]),
            zoom: 8,
          }),
          controls: defaultControls(attribution),
          options: {},
        });
      }
      this.needsToLoad = !this.needsToLoad;
    }
  }
}

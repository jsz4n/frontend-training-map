import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM, Vector } from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import Point from 'ol/geom/Point';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import JSONFeature from 'ol/format/JSONFeature';
import { fromLonLat } from 'ol/proj';
import { Attribution, defaults as defaultControls } from 'ol/control';

//TODO: Add openlayer here
export default class Mapr1Component extends Component {
  @service store;
  needsToLoad = true;
  regionMap = undefined;
  addresses=[];
  cities = new Collection();
  osmLayer = new TileLayer({ source: new OSM() });
  source = new Vector();
  vectorLayer = new VectorLayer({source: this.source, style:this.getStyle});


  getStyle(feature){
      const fill = new Fill({color: 'rgba(50,255,60,0.5)'});
      const stroke = new Stroke({color: '#3399CC', width: 1});
      return new Style({
          image: new CircleStyle({fill:fill, stroke:stroke, radius:8}),
      });
  }


  @action 
  updateCities(newCities){
      let cities = newCities.filter(x=>!!x);
      this.addresses = cities;
      console.log(cities);
      let features = cities.map(
          city =>
          ({
              type: "Feature",
              geometry:// new Point([ city.long, city.lat ]),
              {
                  type: "Point",
                  coordinates: fromLonLat([city.long,city.lat]),
              },
              properties: {
                  zipcode: city.postcode,
                  name:city.name
              }
          })
      ) 
     this.updateMap(features);
  }

  updateMap(features){
      this.initMap();
      this.cities = { "type": "FeatureCollection", "features":features};
      this.source.clear(true);
      this.source.addFeatures(new GeoJSON().readFeatures(this.cities));
      this.source.changed();
      //this.source.refresh();
      //console.log(this.source);
      this.regionMap.render();
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
          layers: [this.osmLayer, this.vectorLayer],
          target: 'map',
          view: new View({
            center: fromLonLat([3.956461, 51.010871]),
            zoom: 8,
          }),
          controls: defaultControls(attribution),
        });
      }
      this.needsToLoad = !this.needsToLoad;
    }
  }
}

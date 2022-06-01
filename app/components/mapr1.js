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
      const fill = new Fill({color: '#33FF55'});
      const stroke = new Stroke({color: '#3399CC', width: 1});
      return new Style({
          image: new CircleStyle({fill:fill, stroke:stroke, radius:5}),
      });
  }


  @action 
  updateCities(newCities){
      this.addresses = newCities;
      const ids = Array.from(new Set(newCities.map(x=>`${x.city}_${x.postCode}`)));
      const codes = Array.from(new Set(newCities.map(x=>`${x.postCode}`)));
      const query = this.store.query('city', {postcodes:codes })
      query.then(
          cities => cities.map(
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
      ).then( cities => this.updateMap(cities));
  }

  updateMap(cities){
      this.initMap();
      this.cities = { "type": "FeatureCollection", "features":cities};
      this.source.clear(true);
      this.source.addFeatures(new GeoJSON().readFeatures(this.cities));
      this.source.changed();
      console.log(this.source);
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

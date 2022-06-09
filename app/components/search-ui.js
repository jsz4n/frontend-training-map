import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import { GeoJSON, JSONFeature } from 'ol/format';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import View from 'ol/View';
import { Attribution, defaults as defaultControls } from 'ol/control';
import { OSM, Vector } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';


export default class SearchUiComponent extends Component {
    @service store;
    @tracked displayedResult = [];
    @tracked addresses = [];
    @tracked cities = [];
    @tracked contactpoints = [];
    osmLayer = new TileLayer({ source: new OSM() });
    source = new Vector();
    vectorLayer = new VectorLayer({ source: this.source, style: this.getStyle });
    @tracked selectedCity = "";
    popup_overlay = new Overlay({ element: document.getElementById("map"),offset: [ 0,-10] });


    //map functions
    @action
    getStyle(feature) {
        console.log(feature.getProperties());
        const selected=(this.selectedCity==feature.getProperties().name)
        const fill = (selected)
            ?new Fill({ color: 'rgba(255,255,0,0.7)' })
            :new Fill({ color: 'rgba(127,255,10,0.4)' });
        const stroke = (selected)
            ?new Stroke({ color:'#BB8833', width:1})
            :new Stroke({ color: '#3388BB', width: 1 });
        const text = new Text({
            placement: 'point',
            fill: new Fill({ color: '#fff' }),
            stroke: new Stroke({ color: '#000', width: 2 }),
        });
        return new Style({
            image: new CircleStyle({ fill, stroke, text, radius: 8 }),
        });
    }

    createFeatures(cities){
        return new GeoJSON().readFeatures({ type: 'FeatureCollection', features:
            cities.map(
                city =>
                ({
                    type: "Feature",
                    geometry:
                    {
                        type: "Point",
                        coordinates: fromLonLat([city.long, city.lat]),
                    },
                    properties: {
                        zipcode: city.postcode,
                        name:city.name,
                        addresses: city.addresses
                    }
                })
            )
        });
    }

    @action
    showDetails(evt){
        let feature = evt.target.forEachFeatureAtPixel(evt.pixel, (feat, layer)=> feat);
        if (feature){
            let geometry = feature.getGeometry();
            let coord = geometry.getCoordinates();
            let properties = feature.getProperties();
            //this.selectedCity = properties.name;
            //this.popup_overlay.setPosition(coord);
            this.selectedCity = properties.name;
            const selected = properties.name;
            console.log(selected);
            document.getElementById("city-popup").style.visibility= "visible";
            this.store
                .query('contactpoint', {
                    filter: { address: selected },
                    include: 'address',
                })
                .then( (cps) =>  cps.filter(x=>x.address.get("city")==selected))
                .then((cps) => (this.contactpoints = cps));
        this.vectorLayer.changed();
        }
    }


    @action
    LoadMap() {
        const map = new Map({
            layers: [ this.osmLayer, this.vectorLayer ],
            target: 'map',
            view: new View({
                center: fromLonLat([3.956461, 51.010871]),
                zoom: 8,
            }),
        });
        map.on('click', this.showDetails);
        map.addOverlay(this.popup_overlay);
        this.regionMap = map;
    }

    //search functions
    @action
    selectAddr(act) {
        const selected = act.srcElement.text;
        console.log(selected);
        this.selectedCity=selected;
        document.getElementById("city-popup").style.visibility= "visible";
        this.store
            .query('contactpoint', {
                filter: { address: selected },
                include: 'address',
            })
            .then( (cps) =>  cps.filter(x=>x.address.get("city")==selected))
            .then((cps) => (this.contactpoints = cps));
        this.vectorLayer.changed();
    }



    @action
    doSearch(act) {
        const value = act.srcElement.value;
        if (value.length >= 2) {
            this.store
                .query('address', {
                    filter: { city: value },
                    include: "contactpoints",
                    include: 'citydetails',
                    page: {size:35}
                })
                .then((searchResults) => {
                    if ( act.srcElement.value === searchResults.query.filter.city ) {
                        this.addresses = searchResults;
                        this.displayedResult = Array.from(
                            new Set(searchResults.map((x) => x.city)
                                //.map(x =>{ console.log(x); return x})
                                //.filter(x=> !!x && !!x.get("long") && !!x.get("lat"))
                            ));
                        Promise.all(
                            searchResults
                                .map((x) => x.citydetails)
                                .filter(x=> !!x.get("long") && !!x.get("lat"))
                        ).then( (details) =>{
                            this.cities = details;
                            this.source.clear(true);
                            this.features = this.createFeatures(this.cities)
                            this.source.addFeatures(this.features);
                            this.regionMap.render();
                        });

                    }
                });
        }
    }

}

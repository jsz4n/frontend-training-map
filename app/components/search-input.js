
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class SearchInputComponent extends Component {
    @service store;
    @tracked cities=[];
    @tracked results=[];


    @action
    search(act){
        const value = act.srcElement.value;
        if (value.length>= 1){
            //console.log(act)
            this.store.query('address',
                {
                    filter: { city: value },
                    sort: "city",
                    include: "citydetails",
                    page: {size:20}
                    //include: "cities"

                }).then(results =>{
                        if(act.srcElement.value == results.query.filter.city){
                            this.results = results;
                            this.cities = Array.from(new Set(results.map(x=>x.city)));
                            Promise.all(results
                                .map(x=>x.citydetails))
                                .then(this.args.updateMap)
                        }
                    });
        }
    }


}

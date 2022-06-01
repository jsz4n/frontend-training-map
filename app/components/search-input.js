
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

                }).then(result =>{
                        this.results=result;
                        this.cities = Array.from(new Set(result.map(x=>x.city)));
                        this.args.updateMap(result);
                    }
                    );
        }
    }


}

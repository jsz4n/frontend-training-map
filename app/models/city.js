import Model, { attr, belongsTo } from '@ember-data/model';

export default class CityModel extends Model {
  @attr name;
  @attr lat;
  @attr long;
  @attr postcode;
  @belongsTo('address') address;
}

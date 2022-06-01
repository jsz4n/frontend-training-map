import Model, { attr, belongsTo } from '@ember-data/model';

export default class AddressModel extends Model {
  @attr city;
  @attr addr;
  @belongsTo('contactpoint') contactpoint;
}

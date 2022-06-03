import Model, { attr,  belongsTo } from '@ember-data/model';

export default class contactpointModel extends Model {
  @attr mail;
  @attr phone;
  //@attr address;
  @belongsTo('address') address;
}

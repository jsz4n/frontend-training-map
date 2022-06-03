import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class AddressModel extends Model {
  @attr city;
  @attr addr;
  @belongsTo('contactpoint') contactpoint;
  @belongsTo('city') citydetails;
  get postCode(){
      return this.addr.match(/, (?<postcode>\d{4}) /).groups.postcode;
  }
}

import Model, { attr, belongsTo } from '@ember-data/model';

export default class contactpointModel extends Model {
  @attr mail;
  @attr phone;
  //@attr address;
  @belongsTo('address') address;

  get email(){
      return this.mail.toLowerCase();
  }

  get hasMail(){
      return (this.mail) && !(this.mail === "");
  }
  get hasPhone(){
      return (this.phone) && !(this.phone === "");
  }

  get isPerson(){
      let [names,domain] = this.mail.split("@");
      return names.indexOf(".")!=-1;
  }
  get firstname(){
      let fname = this.mail.split(".")[0].toLowerCase();
      let firstC=fname.charAt(0).toUpperCase()
      return firstC+fname.substring(1);
  }

  get lastname(){
      return this.mail.split(".")[1].split("@")[0].toUpperCase();
  }

  get telephone(){
      if (this.phone){
          let p= this.phone.replace(/\s+|\/+|[a-z]+|[A-Z]+|\./g,"");
          p = (p.charAt(0)=="+")?p:(p.charAt(0)=="0"?"+32"+p.slice(1):"+32"+p);
          return p;
      }
      return "";
  }
}

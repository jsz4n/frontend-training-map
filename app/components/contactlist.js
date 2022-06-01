import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class Mapr1Component extends Component {
  @service store;
  contactpoints = this.store.findAll('contactpoint');
}

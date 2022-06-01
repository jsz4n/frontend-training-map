import Route from '@ember/routing/route';

export default class R1Route extends Route {
  model() {
    return [1, 2, 3, 4];
  }
}

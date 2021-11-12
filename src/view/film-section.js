/* eslint-disable no-underscore-dangle */
import Abstract from './abstract';

export default class FilmSection extends Abstract {
  constructor() {
    super();
    this._markup = '<section class="films"></section>';
  }

  getTemplate() {
    return this._markup;
  }
}

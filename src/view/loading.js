/* eslint-disable no-underscore-dangle */
import AbstractView from './abstract';

export default class Loading extends AbstractView {
  constructor() {
    super();
    this._markup = '<h2 class="films-list__title">Loading...</h2>';
  }

  getTemplate() {
    return this._markup;
  }
}

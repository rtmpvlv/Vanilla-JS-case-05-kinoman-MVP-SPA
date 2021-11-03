/* eslint-disable no-underscore-dangle */
import { createElement } from '../utils';

export default class NoMovies {
  constructor() {
    this._element = null;
    this._markup = `
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
    `;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._markup);
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

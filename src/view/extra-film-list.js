/* eslint-disable no-underscore-dangle */
import { createElement } from '../utils';

export default class ExtraFilmList {
  constructor() {
    this._element = null;
    this._markup = `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">
      </div>
    </section>`;
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

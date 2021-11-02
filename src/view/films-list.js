/* eslint-disable no-underscore-dangle */
import { createElement } from '../utils';

export default class FilmsList {
  constructor() {
    this._element = null;
    this._markup = `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
      </div>

      <button class="films-list__show-more">Show more</button>
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

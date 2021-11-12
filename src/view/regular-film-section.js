/* eslint-disable no-underscore-dangle */
import Abstract from './abstract';

export default class RegularFilmSection extends Abstract {
  constructor() {
    super();
    this._markup = `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`;
  }

  getTemplate() {
    return this._markup;
  }
}

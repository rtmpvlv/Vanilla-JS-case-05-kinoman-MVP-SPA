/* eslint-disable no-underscore-dangle */
import Abstract from './abstract';

export default class FilmsList extends Abstract {
  constructor() {
    super();
    this._markup = `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
      </div>

      <button class="films-list__show-more">Show more</button>
    </section>
  `;
  }

  getTemplate() {
    return this._markup;
  }
}

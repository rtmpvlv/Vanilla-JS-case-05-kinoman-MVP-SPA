/* eslint-disable no-underscore-dangle */
import Abstract from './abstract';

export default class ExtraFilmList extends Abstract {
  constructor() {
    super();
    this._markup = `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">
      </div>
    </section>`;
  }

  getTemplate() {
    return this._markup;
  }
}

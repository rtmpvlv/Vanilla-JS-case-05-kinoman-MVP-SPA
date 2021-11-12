/* eslint-disable no-underscore-dangle */
import Abstract from './abstract';

export default class ExtraFilmSection extends Abstract {
  constructor() {
    super();
    this._markup = `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
    </section>`;
  }

  getTemplate() {
    return this._markup;
  }
}

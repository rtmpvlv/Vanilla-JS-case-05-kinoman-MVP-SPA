/* eslint-disable no-underscore-dangle */
import Abstract from './abstract';

export default class NoMovies extends Abstract {
  constructor() {
    super();
    this._markup = `
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
    `;
  }

  getTemplate() {
    return this._markup;
  }
}

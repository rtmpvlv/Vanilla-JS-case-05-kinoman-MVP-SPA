/* eslint-disable no-underscore-dangle */
import Abstract from './abstract';

export default class FilmContainer extends Abstract {
  constructor() {
    super();
    this._markup = `
      <div class="films-list__container">
      </div>
  `;
  }

  getTemplate() {
    return this._markup;
  }
}

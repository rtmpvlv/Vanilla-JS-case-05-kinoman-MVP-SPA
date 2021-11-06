/* eslint-disable no-underscore-dangle */
import Abstract from './abstract';

export default class Sort extends Abstract {
  constructor() {
    super();
    this._markup = `
    <ul class="sort">
      <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" class="sort__button">Sort by date</a></li>
      <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>
  `;
  }

  getTemplate() {
    return this._markup;
  }
}

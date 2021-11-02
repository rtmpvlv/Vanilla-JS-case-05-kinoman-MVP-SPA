/* eslint-disable no-underscore-dangle */
import { createElement } from '../utils';

const createFilterItemTemplate = ((array) => array.map(({ name, count }) => `<a href="#watchlist" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`).join(''));

const createMenuTemplate = (filter) => (`<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${createFilterItemTemplate(filter)}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
);

export default class Menu {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  getTemplate() {
    return createMenuTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

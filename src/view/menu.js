/* eslint-disable no-underscore-dangle */
import Abstract from './abstract';
import { FilterType } from '../utils/const';

const createFilterItemTemplate = ((filters, currentFilterType) => filters.map(({ type, name, count }) => `
  <a href="#" id="${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">
  ${name} ${type !== FilterType.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ''}
  </a>`).join('')
);

const createMenuTemplate = (filters, currentFilterType) => (`
  <nav class="main-navigation">
    <div class="main-navigation__items">
      ${createFilterItemTemplate(filters, currentFilterType)}
    </div>
    <a id="stats" href="#" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class Menu extends Abstract {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._activeStats = false;

    this._menuChangeHandler = this._menuChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._currentFilterType);
  }

  _menuChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === 'A') {
      const links = this.getElement().querySelectorAll('a');
      links.forEach((link) => link.classList.remove('main-navigation__item--active'));
      evt.target.classList.add('main-navigation__item--active');
      this._callback.menuChange(evt.target.id);
    }
  }

  setMenuChangeHandler(callback) {
    this._callback.menuChange = callback;
    this.getElement().addEventListener('click', this._menuChangeHandler);
  }
}

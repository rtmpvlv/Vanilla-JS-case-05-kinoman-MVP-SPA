/* eslint-disable no-underscore-dangle */
import Abstract from './abstract';

const createFilterItemTemplate = ((filters, currentFilterType) => filters.map(({ type, name, count }) => `
  <a href="#" id="${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">
  ${name}<span class="main-navigation__item-count">
  ${count}</span>
  </a>`).join('')
);

const createMenuTemplate = (filters, currentFilterType) => (`
  <nav class="main-navigation">
    <div class="main-navigation__items">
      ${createFilterItemTemplate(filters, currentFilterType)}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class Menu extends Abstract {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === 'A') {
      this._callback.filterTypeChange(evt.target.id);
    }
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}

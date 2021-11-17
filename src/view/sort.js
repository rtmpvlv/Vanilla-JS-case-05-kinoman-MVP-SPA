/* eslint-disable no-underscore-dangle */
import Abstract from './abstract';
import SortType from '../utils/const';

let CHECKED_SORT_TYPE = SortType.DEFAULT;

export default class Sort extends Abstract {
  constructor() {
    super();
    this._markup = `
    <ul class="sort">
      <li><a href="#" class="sort__button ${CHECKED_SORT_TYPE === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button ${CHECKED_SORT_TYPE === SortType.DATE ? 'sort__button--active' : ''}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button ${CHECKED_SORT_TYPE === SortType.RATING ? 'sort__button--active' : ''}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
    </ul>`;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return this._markup;
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    CHECKED_SORT_TYPE = evt.target.dataset.sortType;
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}

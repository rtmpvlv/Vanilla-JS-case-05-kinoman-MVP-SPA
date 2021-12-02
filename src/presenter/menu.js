/* eslint-disable no-underscore-dangle */
import MenuView from '../view/menu';
import {
  render,
  replace,
  remove,
  RenderPosition
} from '../utils/render';
import filter from '../utils/filter';
import { FilterType } from '../utils/const';

export default class Menu {
  constructor(filterContainer, filterModel, moviesModel, handleSiteMenuClick) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;
    this._handleSiteMenuClick = handleSiteMenuClick;

    this._menuView = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._menuView;

    this._menuView = new MenuView(filters, this._filterModel.getFilter());
    this._menuView.setMenuChangeHandler(this._handleSiteMenuClick);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._menuView, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._menuView, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _getFilters() {
    const films = this._moviesModel.getMovies();

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }
}

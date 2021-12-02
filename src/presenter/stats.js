/* eslint-disable default-case */
/* eslint-disable no-underscore-dangle */
import StatsView from '../view/stats';
import { remove, render, replace } from '../utils/render';

export default class Stats {
  constructor(place, moviesModel) {
    this._place = place;
    this._moviesModel = moviesModel;
    this._statsPresenter = null;
  }

  render() {
    this._movies = this._moviesModel.getMovies();
    const prevStatsPresenter = this._statsPresenter;
    this._statsPresenter = new StatsView(this._movies);

    if (prevStatsPresenter === null) {
      render(this._place, this._statsPresenter);
      return;
    }

    replace(this._statsPresenter, prevStatsPresenter);
    remove(prevStatsPresenter);
  }

  destroy() {
    remove(this._statsPresenter);
    this._statsPresenter = null;
  }
}

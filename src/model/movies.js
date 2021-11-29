/* eslint-disable no-underscore-dangle */
import AbstractObserver from '../utils/abstract-observer';

export default class Movies extends AbstractObserver {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(movies) {
    this._movies = movies.slice();
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addMovie(updateType, update) {
    this._movies = [
      update,
      ...this._movies,
    ];

    this._notify(updateType, update);
  }

  deleteMovie(updateType, update) {
    const index = this._movies.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting movie');
    }

    this._movies.splice(index, 1);
    this._notify(updateType);
  }
}

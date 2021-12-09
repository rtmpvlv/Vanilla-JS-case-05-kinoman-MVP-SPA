/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-object-spread */
import MoviesModel from '../model/movies';

const getSyncedMovies = (items) => items
  .filter(({ success }) => success)
  .map(({ payload }) => payload.movie);

const createStoreStructure = (items) => items
  .reduce((acc, current) => Object.assign({}, acc, {
    [current.id]: current,
  }), {});

export default class Provider {
  constructor(api, storeMovies, storeComments, commentsModel) {
    this._api = api;
    this._storeMovies = storeMovies;
    this._storeComments = storeComments;
    this._commentsModel = commentsModel;
  }

  getMovies() {
    if (window.navigator.onLine) {
      return this._api.getMovies()
        .then((movies) => {
          const items = createStoreStructure(movies.map(MoviesModel.adaptToServer));
          this._storeMovies.setItems(items);
          return movies;
        });
    }

    const storeMovies = Object.values(this._storeMovies.getItems());
    return Promise.resolve(storeMovies.map(MoviesModel.adaptToClient));
  }

  getComments(movie) {
    if (window.navigator.onLine) {
      return this._api.getComments(movie)
        .then((comments) => {
          comments.forEach((comment) => this._commentsModel.setComment(comment));
          return comments;
        })
        .then((comments) => {
          const items = createStoreStructure(this._commentsModel.getComments());
          this._storeComments.setItems(items);
          return comments;
        });
    }

    const storeComments = Object.values(this._storeComments.getItems());
    return Promise.resolve(storeComments);
  }

  updateMovie(movie) {
    if (window.navigator.onLine) {
      return this._api.updateMovie(movie)
        .then((updatedMovie) => {
          this._storeMovies.setItem(updatedMovie.id, MoviesModel.adaptToServer(updatedMovie));
          return updatedMovie;
        });
    }
    this._storeMovies.setItem(movie.id, MoviesModel.adaptToServer(Object.assign({}, movie)));
    return Promise.resolve(movie);
  }

  addComment(movie) {
    if (window.navigator.onLine) {
      return this._api.addComment(movie)
        .then((newComment) => {
          this._storeComments.setItem(newComment.id, Object.assign({}, movie));
          return newComment;
        });
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(movie) {
    if (window.navigator.onLine) {
      return this._api.deleteComment(movie)
        .then(() => this._storeComments.removeItem(movie.id));
    }

    return Promise.reject(new Error('Delete task failed'));
  }

  sync() {
    if (window.navigator.onLine) {
      const storeMovies = Object.values(this._storeMovies.getItems());

      return this._api.sync(storeMovies)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdMovies = getSyncedMovies(response.created);
          const updatedMovies = getSyncedMovies(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdMovies, ...updatedMovies]);

          this._storeMovies.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}

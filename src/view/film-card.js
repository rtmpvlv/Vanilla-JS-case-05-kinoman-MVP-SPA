/* eslint-disable no-underscore-dangle */
import dayjs from 'dayjs';
import { convertDuration } from '../utils/popup';
import Abstract from './abstract';

const createFilmsCardTemplate = (film) => {
  const { comments, filmInfo, userDetails } = film;

  const getDescription = (description) => {
    if (description.length > 140) {
      return `${description.slice(0, 139)}...`;
    }
    return description;
  };

  return `
    <article class="film-card">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${dayjs(filmInfo.release.date).format('YYYY')}</span>
        <span class="film-card__duration">${convertDuration(filmInfo.runtime)}</span>
        <span class="film-card__genre">${filmInfo.genre[0]}</span>
      </p>
      <img src="${filmInfo.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${getDescription(filmInfo.description)}</p>
      <a class="film-card__comments">${comments.length === 1 ? '1 comment' : `${comments.length} comments`}</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${userDetails.watchList ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${userDetails.alreadyWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${userDetails.favorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
      </div>
    </article>`;
};

export default class FilmCard extends Abstract {
  constructor(film) {
    super();
    this._film = film;

    this._openPopupClickHandler = this._openPopupClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._asWatchedClickHandler = this._asWatchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmsCardTemplate(this._film);
  }

  _openPopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.openPopup();
  }

  setOpenPopupClickHandler(callback) {
    this._callback.openPopup = callback;
    this.getElement().querySelector('.film-card img').addEventListener('click', this._openPopupClickHandler);
    this.getElement().querySelector('.film-card h3').addEventListener('click', this._openPopupClickHandler);
    this.getElement().querySelector('.film-card a').addEventListener('click', this._openPopupClickHandler);
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  _asWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.asWatchedClick();
  }

  setAsWatchedClickHandler(callback) {
    this._callback.asWatchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._asWatchedClickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }
}

/* eslint-disable no-underscore-dangle */
import dayjs from 'dayjs';
import { convertDuration } from '../mock-data/utils-and-const';
import Abstract from './abstract';

const createFilmsCardTemplate = (film) => {
  const { comments, filmInfo } = film;
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
      <p class="film-card__description">${filmInfo.description}</p>
      <a class="film-card__comments">${comments.length > 1 ? `${comments.length} comments` : '1 comment'}</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
      </div>
    </article>
  `;
};

export default class FilmCard extends Abstract {
  constructor(film) {
    super();
    this._film = film;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmsCardTemplate(this._film);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.film-card img').addEventListener('click', this._editClickHandler);
    this.getElement().querySelector('.film-card h3').addEventListener('click', this._editClickHandler);
    this.getElement().querySelector('.film-card a').addEventListener('click', this._editClickHandler);
  }
}

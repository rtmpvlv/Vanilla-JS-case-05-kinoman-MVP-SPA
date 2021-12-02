/* eslint-disable no-underscore-dangle */
import Abstract from './abstract';
import { calcWatchedMovies } from '../utils/sort';

export default class Profile extends Abstract {
  constructor(movies) {
    super();
    this._movies = movies;
    this._markup = `
    <section class="header__profile profile">
      <p class="profile__rating">${calcWatchedMovies(this._movies).rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
  }

  getTemplate() {
    return this._markup;
  }
}

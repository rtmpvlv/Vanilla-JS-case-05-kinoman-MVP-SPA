/* eslint-disable no-underscore-dangle */
import { createElement } from '../utils';

export default class Profile {
  constructor() {
    this._element = null;
    this._markup = `
    <section class="header__profile profile">
      <p class="profile__rating">Movie Buff</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._markup);
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

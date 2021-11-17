/* eslint-disable no-underscore-dangle */
import Abstract from './abstract';

export default class Profile extends Abstract {
  constructor() {
    super();
    this._markup = `
    <section class="header__profile profile">
      <p class="profile__rating">Movie Buff</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
  }

  getTemplate() {
    return this._markup;
  }
}

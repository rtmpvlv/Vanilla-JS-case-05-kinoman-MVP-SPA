/* eslint-disable no-underscore-dangle */
import { getRandomInteger } from '../mock-data/utils-and-const';
import { createElement } from '../utils';

export default class FilmQuantity {
  constructor() {
    this._element = null;
    this._markup = `
    <p>${getRandomInteger(10000, 1000000)} movies inside</p>
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

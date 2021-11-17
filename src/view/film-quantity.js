/* eslint-disable no-underscore-dangle */
import { getRandomInteger } from '../mock-data/utils-and-const';
import Abstract from './abstract';

export default class FilmQuantity extends Abstract {
  constructor() {
    super();
    this._markup = `
    <p>${getRandomInteger(10000, 100000)} movies inside</p>`;
  }

  getTemplate() {
    return this._markup;
  }
}

/* eslint-disable no-underscore-dangle */
import AbstractView from './abstract';

export default class FilmQuantity extends AbstractView {
  constructor() {
    super();
    this._markup = '<p>0 movies inside</p>';
  }

  getTemplate() {
    return this._markup;
  }
}

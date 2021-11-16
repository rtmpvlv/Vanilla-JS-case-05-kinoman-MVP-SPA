/* eslint-disable prefer-object-spread */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import Abstract from './abstract';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateData(update, justDataUpdate) {
    if (!update) {
      return;
    }
    this._data = Object.assign({}, this._data, update);

    if (justDataUpdate) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Cannot change abstract method \'restoreHandlers\'.');
  }
}

/* eslint-disable no-underscore-dangle */
import Abstract from './abstract';

export default class ShowMoreButton extends Abstract {
  constructor() {
    super();
    this._markup = '<button class="films-list__show-more">Show more</button>';
    this._showMoreClickHandler = this._showMoreClickHandler.bind(this);
  }

  getTemplate() {
    return this._markup;
  }

  _showMoreClickHandler(evt) {
    evt.preventDefault();
    this._callback.showMoreClick();
  }

  setShowMoreClickHandler(callback) {
    this._callback.showMoreClick = callback;
    this.getElement().addEventListener('click', this._showMoreClickHandler);
  }
}

/* eslint-disable no-underscore-dangle */
import CommentsView from '../view/comments';
import { remove, render, replace } from '../utils/render';

export default class Comments {
  constructor(place, film) {
    this._place = place;
    this._film = film;
    this._commentsView = null;
  }

  renderComments() {
    const prevCommentsView = this._commentsView;
    this._commentsView = new CommentsView(this._film);
    if (prevCommentsView === null) {
      render(this._place, this._commentsView);
      return;
    }
    replace(this._commentsView, prevCommentsView);
    remove(prevCommentsView);
  }
}

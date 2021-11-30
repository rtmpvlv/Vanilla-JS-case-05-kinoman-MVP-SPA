/* eslint-disable no-underscore-dangle */
import AbstractObserver from '../utils/abstract-observer';

export default class Comments extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  updateCommentsList(updateType, update) {
    const index = this._comments.findIndex((comment) => comment.id === update.comments.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting comment');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      update,
      ...this._comments.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}

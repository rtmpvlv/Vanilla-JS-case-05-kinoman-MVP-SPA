/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-object-spread */
import Smart from './smart';
import { humanizeDate } from '../utils/popup';

const createCommentsTemplate = (data) => {
  const { comments } = data;
  const commentsListItem = comments.map((item) => `
  <li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${item.emotion}.png" width="55" height="55" alt="emoji-${item.emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${item.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${item.author}</span>
        <span class="film-details__comment-day">${humanizeDate(item.date)}</span>
        <button class="film-details__comment-delete"  id="${item.id}">Delete</button>
      </p>
    </div>
  </li>`).join('');
  const commentsList = `<ul class="film-details__comments-list">${commentsListItem}</ul>`;

  return commentsList;
};

export default class Comments extends Smart {
  constructor(film) {
    super();
    this._data = Comments.parseFormToData(film);
    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);

    this._setInnerHandlers();
  }

  static parseFormToData(film) {
    return Object.assign({}, film);
  }

  static parseDataToForm(data) {
    return Object.assign({}, data);
  }

  getTemplate() {
    return createCommentsTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement().querySelectorAll('.film-details__comment')
      .forEach((item) => item.addEventListener('click', this._commentDeleteHandler));
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    const pickedComment = Number(evt.target.id);
    const index = this._data.comments.findIndex((item) => item.id === pickedComment);
    if (index < 0) {
      return;
    }
    this.updateData({
      comments: [
        ...this._data.comments.slice(0, index),
        ...this._data.comments.slice(index + 1),
      ],
    });
  }
}

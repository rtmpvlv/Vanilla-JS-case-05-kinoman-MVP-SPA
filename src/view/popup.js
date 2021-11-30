/* eslint-disable prefer-object-spread */
/* eslint-disable no-underscore-dangle */
import he from 'he';
import dayjs from 'dayjs';
import { Emotions, getRandomInteger } from '../mock-data/utils-and-const';
import { render } from '../utils/render';
import Smart from './smart';
import { convertDuration, humanizeDate } from '../utils/popup';

const createPopupTemplate = (data) => {
  const { comments, filmInfo, userDetails } = data;

  const createCommentsTemplate = () => {
    const commentsListItem = comments.map((item) => `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${item.emotion}.png" width="55" height="55" alt="emoji-${item.emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(item.comment)}</p>
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

  const renderGenres = (array) => array.map((item) => `<span class="film-details__genre">${item}</span>`).join('');
  return `
    <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

              <p class="film-details__age">${filmInfo.ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${filmInfo.title}</h3>
                  <p class="film-details__title-original">${filmInfo.alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${filmInfo.totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${filmInfo.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${dayjs(filmInfo.release.date).format('DD MMMM YYYY')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${convertDuration(filmInfo.runtime)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${filmInfo.release.country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${filmInfo.genre.length > 1 ? 'Genres' : 'Genre'}</td>
                  <td class="film-details__cell">${renderGenres(filmInfo.genre)}</td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${filmInfo.description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist ${userDetails.watchList ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button film-details__control-button--watched ${userDetails.alreadyWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite ${userDetails.favorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">(${comments.length})</span></h3>
            ${createCommentsTemplate()}
            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>
  `;
};

export default class Popup extends Smart {
  constructor(film) {
    super();
    this._data = Popup.parseFormToData(film);

    this._closePopupClickHandler = this._closePopupClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._asWatchedClickHandler = this._asWatchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);
    this._deleteCommentClickHandler = this._deleteCommentClickHandler.bind(this);
    this._addCommentClickHandler = this._addCommentClickHandler.bind(this);

    this.setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  reset(film) {
    this.updateData(Popup.parseFormToData(film));
  }

  _closePopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.popupClick();
  }

  setClosePopupClickHandler(callback) {
    this._callback.popupClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closePopupClickHandler);
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  _asWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.asWatchedClick();
  }

  setAsWatchedClickHandler(callback) {
    this._callback.asWatchedClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._asWatchedClickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  _deleteCommentClickHandler(evt) {
    evt.preventDefault();
    this._commentDeleteHandler(evt);
    this._callback.deleteCommentClick(Popup.parseDataToForm(this._data));
  }

  setDeleteCommentClickHandler(callback) {
    this._callback.deleteCommentClick = callback;
    this.getElement()
      .querySelectorAll('.film-details__comment')
      .forEach((item) => item.addEventListener('click', this._deleteCommentClickHandler));
  }

  _addCommentClickHandler(evt) {
    if (evt.ctrlKey && evt.keyCode === 13) {
      const newComment = {
        author: 'You',
        comment: this._data.newComment,
        id: getRandomInteger(1, 10000000),
        date: new Date(),
        emotion: this._data.emoji,
      };

      delete this._data.newComment;
      delete this._data.emoji;

      this.updateData({
        comments: [...this._data.comments, newComment],
      });
      this._callback.addCommentClick(Popup.parseDataToForm(this._data));
    }
  }

  setAddCommentClickHandler(callback) {
    this._callback.addCommentClick = callback;
    this.getElement().addEventListener('keydown', this._addCommentClickHandler);
  }

  _emojiChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === 'IMG') {
      this.updateData({
        emoji: evt.target.src,
      });
      this.getElement().scrollTo(0, this.getElement().scrollHeight);
      this._renderEmojiPic();
    }
  }

  restoreHandlers() {
    this.setInnerHandlers();
    this.setClosePopupClickHandler(this._callback.popupClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setAsWatchedClickHandler(this._callback.asWatchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setDeleteCommentClickHandler(this._callback.deleteCommentClick);
    this.setAddCommentClickHandler(this._callback.addCommentClick);
  }

  static parseFormToData(point) {
    return Object.assign({}, point);
  }

  static parseDataToForm(data) {
    return Object.assign({}, data);
  }

  setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputHandler);
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('click', this._emojiChangeHandler);
  }

  _commentInputHandler(evt) {
    this.updateData({
      newComment: evt.target.value,
    }, true);
  }

  _commentDeleteHandler(evt) {
    if (evt.target.tagName === 'BUTTON') {
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
      this.getElement().scrollTo(0, this.getElement().scrollHeight);
    }
  }

  _renderEmojiPic() {
    Emotions.forEach((item) => {
      if (this._data.emoji.includes(item)) {
        this.updateData({
          emoji: item,
        }, true);
        const img = document.createElement('img');
        img.src = `./images/emoji/${item}.png`;
        img.style.width = '55px';
        img.style.height = '55px';
        render(this.getElement().querySelector('.film-details__add-emoji-label'), img);
      }
    });
  }
}

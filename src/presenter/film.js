/* eslint-disable prefer-object-spread */
/* eslint-disable no-underscore-dangle */
import FilmCardView from '../view/film-card';
import PopupView from '../view/popup';
import { render, replace, remove } from '../utils/render';
import { UpdateType, UserAction } from '../utils/const';

const Mode = {
  FILM_CARD: 'FILM_CARD',
  POPUP: 'POPUP',
};

export default class Film {
  constructor(filmContainer, changeData, changeMode) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCard = null;
    this._popup = null;
    this._mode = Mode.FILM_CARD;

    this._keyPressed = this._keyPressed.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._openPopup = this._openPopup.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleAsWatchedClick = this._handleAsWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleCommentsChange = this._handleCommentsChange.bind(this);
  }

  renderFilmCard(film) {
    this._film = film;
    const prevFilmCard = this._filmCard;
    const prevPopup = this._popup;
    this._filmCard = new FilmCardView(film);
    this._popup = new PopupView(film);

    this._filmCard.setOpenPopupClickHandler(this._openPopup);
    this._filmCard.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCard.setAsWatchedClickHandler(this._handleAsWatchedClick);
    this._filmCard.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popup.setClosePopupClickHandler(this._closePopup);
    this._popup.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popup.setAsWatchedClickHandler(this._handleAsWatchedClick);
    this._popup.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popup.setDeleteCommentClickHandler(this._handleCommentsChange);
    this._popup.setAddCommentClickHandler(this._handleCommentsChange);

    if (prevFilmCard === null || prevPopup === null) {
      render(this._filmContainer, this._filmCard);
      return;
    }

    replace(this._filmCard, prevFilmCard);
    replace(this._popup, prevPopup);
    remove(prevFilmCard);
    remove(prevPopup);
  }

  destroy() {
    remove(this._filmCard);
    remove(this._popup);
  }

  resetView() {
    if (this._mode !== Mode.FILM_CARD) {
      remove(this._popup);
      this._mode = Mode.FILM_CARD;
    }
  }

  _keyPressed(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this._keyPressed);
      this._mode = Mode.FILM_CARD;
      remove(this._popup);
    }
  }

  _closePopup() {
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._keyPressed);
    this._mode = Mode.FILM_CARD;
    remove(this._popup);
  }

  _openPopup() {
    document.body.classList.add('hide-overflow');
    this._changeMode();
    render(document.body, this._popup);
    this._popup.restoreHandlers();
    document.addEventListener('keydown', this._keyPressed);
    this._mode = Mode.POPUP;
  }

  _handleWatchlistClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            watchList: !this._film.userDetails.watchList,
            alreadyWatched: this._film.userDetails.alreadyWatched,
            favorite: this._film.userDetails.favorite,
          },
        },
      ),
    );
  }

  _handleAsWatchedClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            watchList: this._film.userDetails.watchList,
            alreadyWatched: !this._film.userDetails.alreadyWatched,
            favorite: this._film.userDetails.favorite,
          },
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            watchList: this._film.userDetails.watchList,
            alreadyWatched: this._film.userDetails.alreadyWatched,
            favorite: !this._film.userDetails.favorite,
          },
        },
      ),
    );
  }

  _handleCommentsChange(film) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          comments: film.comments,
        },
      ),
    );
  }
}

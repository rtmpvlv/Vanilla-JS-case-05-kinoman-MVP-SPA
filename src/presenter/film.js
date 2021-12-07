/* eslint-disable prefer-object-spread */
/* eslint-disable no-underscore-dangle */
import FilmCardView from '../view/film-card';
import PopupView from '../view/popup';
import { render, replace, remove } from '../utils/render';
import { FilterType, UpdateType, UserAction } from '../utils/const';

const Mode = {
  FILM_CARD: 'FILM_CARD',
  POPUP: 'POPUP',
};

export default class Film {
  constructor(filmContainer, changeData, changeMode, filterModel, commentsModel, api) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._filterModel = filterModel;
    this._filterType = this._filterModel.getFilter();
    this._commentsModel = commentsModel;
    this._api = api;

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
    this._filmCard = new FilmCardView(film);

    this._filmCard.setOpenPopupClickHandler(this._openPopup);
    this._filmCard.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCard.setAsWatchedClickHandler(this._handleAsWatchedClick);
    this._filmCard.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmCard === null) {
      render(this._filmContainer, this._filmCard);
      return;
    }

    replace(this._filmCard, prevFilmCard);
    remove(prevFilmCard);

    if (this._mode === Mode.POPUP) {
      this._openPopup();
    }
  }

  destroy() {
    remove(this._filmCard);
    this._filmCard = null;
    remove(this._popup);
    this._popup = null;
  }

  resetView() {
    if (this._mode !== Mode.FILM_CARD) {
      remove(this._popup);
      this._popup = null;
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
      this._popup = null;
    }
  }

  _closePopup() {
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._keyPressed);
    remove(this._popup);
    this._popup = null;
    this._mode = Mode.FILM_CARD;
  }

  _openPopup() {
    document.body.classList.add('hide-overflow');
    this._changeMode();
    this._api.getComments(this._film)
      .then((comments) => comments.forEach((comment) => this._commentsModel.setComment(comment)))
      .then(() => {
        const prevPopup = this._popup;
        this._popup = new PopupView(this._film, this._commentsModel);
        this._popup.setClosePopupClickHandler(this._closePopup);
        this._popup.setWatchlistClickHandler(this._handleWatchlistClick);
        this._popup.setAsWatchedClickHandler(this._handleAsWatchedClick);
        this._popup.setFavoriteClickHandler(this._handleFavoriteClick);
        this._popup.setDeleteCommentClickHandler(this._handleCommentsChange);
        this._popup.setAddCommentClickHandler(this._handleCommentsChange);
        if (prevPopup === null) {
          render(document.body, this._popup);
          return;
        }
        replace(this._popup, prevPopup);
        remove(prevPopup);
      });
    document.addEventListener('keydown', this._keyPressed);
    this._mode = Mode.POPUP;
  }

  _chooseFilterType(type) {
    return this._filterType === type
    && this._filterType !== FilterType.ALL
      ? UpdateType.MINOR : UpdateType.PATCH;
  }

  _handleWatchlistClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      this._chooseFilterType(FilterType.WATCHLIST),
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            watchList: !this._film.userDetails.watchList,
            alreadyWatched: this._film.userDetails.alreadyWatched,
            favorite: this._film.userDetails.favorite,
            watchingDate: this._film.userDetails.watchingDate,
          },
        },
      ),
    );
  }

  _handleAsWatchedClick() {
    if (this._film.userDetails.alreadyWatched) {
      this._changeData(
        UserAction.UPDATE_FILM,
        this._chooseFilterType(FilterType.HISTORY),
        Object.assign(
          {},
          this._film,
          {
            userDetails: {
              watchList: this._film.userDetails.watchList,
              alreadyWatched: false,
              favorite: this._film.userDetails.favorite,
              watchingDate: null,
            },
          },
        ),
      );
      return;
    }
    this._changeData(
      UserAction.UPDATE_FILM,
      this._chooseFilterType(FilterType.HISTORY),
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            watchList: this._film.userDetails.watchList,
            alreadyWatched: true,
            favorite: this._film.userDetails.favorite,
            watchingDate: new Date(),
          },
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      this._chooseFilterType(FilterType.FAVORITES),
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            watchList: this._film.userDetails.watchList,
            alreadyWatched: this._film.userDetails.alreadyWatched,
            favorite: !this._film.userDetails.favorite,
            watchingDate: this._film.userDetails.watchingDate,
          },
        },
      ),
    );
  }

  _handleCommentsChange(film) {
    this._changeData(
      UserAction.CHANGE_COMMENTSLIST,
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

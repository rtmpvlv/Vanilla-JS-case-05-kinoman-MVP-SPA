/* eslint-disable no-underscore-dangle */
import FilmSectionView from '../view/film-section';
import RegularFilmSectionView from '../view/regular-film-section';
import FilmContainerView from '../view/film-container';
import NoMoviesView from '../view/no-movies';
import SortView from '../view/sort';
import ShowMoreButtonView from '../view/show-more-button';
import ExtraFilmSectionView from '../view/extra-film-section';
import LoadingView from '../view/loading';
import { render, RenderPosition, remove } from '../utils/render';
import Film from './film';
import {
  FilterType,
  SortType,
  UpdateType,
  UserAction
} from '../utils/const';
import { sortByDate, sortByRating, sortByCommentsLength } from '../utils/sort';
import filter from '../utils/filter';

const FILMCARDS_PER_CLICK = 5;
let RENDERED_FILMCARDS_COUNTER = 0;

export default class FilmList {
  constructor(mainContainer, moviesModel, extraMoviesModel, filterModel, commentsModel, api) {
    this._mainContainer = mainContainer;
    this._moviesModel = moviesModel;
    this._sourcedFilms = moviesModel.getMovies().slice();
    this._extraMoviesModel = extraMoviesModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;
    this._api = api;

    this._currentSortType = SortType.DEFAULT;
    this._filterType = FilterType.ALL;
    this._isLoading = true;

    this._sortView = null;
    this._filmSection = null;
    this._regularFilmSection = null;
    this._showMoreButton = null;
    this._filmContainer = new FilmContainerView();
    this._noMoviesView = new NoMoviesView();
    this._loadingElement = new LoadingView();
    this._filmPresenter = new Map();
    this._topRatedPresenter = new Map();
    this._mostCommentedPresenter = new Map();

    this._renderFiveFilmCards = this._renderFiveFilmCards.bind(this);
    this._renderMoreFilmCards = this._renderMoreFilmCards.bind(this);
    this._handleModelChange = this._handleModelChange.bind(this);
    this._resetViewAll = this._resetViewAll.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewChange = this._handleViewChange.bind(this);

    this._moviesModel.addObserver(this._handleModelChange);
    this._extraMoviesModel.addObserver(this._handleModelChange);
    this._filterModel.addObserver(this._handleModelChange);
    this._commentsModel.addObserver(this._handleModelChange);
  }

  renderView() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._renderSort();
    this._renderFilmSection();

    if (this._getMovies().length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderFilmContainer();
    this._renderFiveFilmCards(RENDERED_FILMCARDS_COUNTER);

    if (this._getMovies().length > FILMCARDS_PER_CLICK) {
      this._renderShowMoreButton();
    }

    this._renderTopRatedSection();
    this._renderMostCommentedSection();
    document.querySelector('.films-list--extra:last-child h2').textContent = 'Most commented';
  }

  _renderLoading() {
    this._renderFilmSection();
    render(this._regularFilmSection, this._loadingElement);
  }

  _getMovies() {
    this._filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies();
    const filteredMovies = filter[this._filterType](movies);

    switch (this._currentSortType) {
      case SortType.DEFAULT:
        return filteredMovies;
      case SortType.DATE:
        return filteredMovies.slice().sort(sortByDate);
      case SortType.RATING:
        return filteredMovies.slice().sort(sortByRating);
      default:
        throw new Error('Enexpected sort type.');
    }
  }

  _renderFilmSection() {
    this._filmSection = new FilmSectionView();
    this._regularFilmSection = new RegularFilmSectionView();

    render(this._mainContainer, this._filmSection);
    render(this._filmSection, this._regularFilmSection);
  }

  _renderFilmContainer() {
    render(this._regularFilmSection, this._filmContainer);
  }

  _renderSort() {
    if (this._sortView !== null) {
      this._sortView = null;
    }

    this._sortView = new SortView(this._currentSortType);
    this._sortView.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._mainContainer, this._sortView);
  }

  _renderFiveFilmCards(counter) {
    const movies = this._getMovies();
    for (
      let i = counter;
      i < counter + Math.min(FILMCARDS_PER_CLICK, this._getMovies().length);
      i += 1) {
      this._renderFilmCard(movies[i], this._filmContainer, this._filmPresenter);
      RENDERED_FILMCARDS_COUNTER += 1;
    }
  }

  _renderMoreFilmCards() {
    this._renderFiveFilmCards(RENDERED_FILMCARDS_COUNTER);
    if (RENDERED_FILMCARDS_COUNTER >= this._getMovies().length) {
      remove(this._showMoreButton);
    }
  }

  _renderFilmCard(film, place, presenter) {
    const filmPresenter = new Film(
      place,
      this._handleViewChange,
      this._resetViewAll,
      this._filterModel,
      this._commentsModel,
      this._api,
    );
    filmPresenter.renderFilmCard(film);
    presenter.set(film.id, filmPresenter);
  }

  _renderShowMoreButton() {
    if (this._showMoreButton !== null) {
      this._showMoreButton = null;
    }

    this._showMoreButton = new ShowMoreButtonView();
    this._showMoreButton.setShowMoreClickHandler(this._renderMoreFilmCards);
    render(this._regularFilmSection, this._showMoreButton);
  }

  _renderNoFilms() {
    this._filmSection = new FilmSectionView();

    render(this._mainContainer, this._filmSection);
    render(this._filmSection, this._noMoviesView, RenderPosition.AFTERBEGIN);
  }

  _renderTopRatedSection() {
    const sortedByRating = this._moviesModel.getMovies().sort(sortByRating);
    const section = new ExtraFilmSectionView();
    const container = new FilmContainerView();
    render(this._filmSection, section);
    render(section, container);
    this._renderFilmCard(sortedByRating[0], container, this._topRatedPresenter);
    this._renderFilmCard(sortedByRating[1], container, this._topRatedPresenter);
  }

  _renderMostCommentedSection() {
    const sortedByCommentsLength = this._moviesModel.getMovies().sort(sortByCommentsLength);
    const section = new ExtraFilmSectionView();
    const container = new FilmContainerView();
    render(this._filmSection, section);
    render(section, container);
    this._renderFilmCard(sortedByCommentsLength[0], container, this._mostCommentedPresenter);
    this._renderFilmCard(sortedByCommentsLength[1], container, this._mostCommentedPresenter);
  }

  clearView({ resetFilmcardsCounter = false, resetSortType = false } = {}) {
    this._filmPresenter.forEach((item) => item.destroy());
    this._filmPresenter.clear();
    this._topRatedPresenter.forEach((item) => item.destroy());
    this._topRatedPresenter.clear();
    this._mostCommentedPresenter.forEach((item) => item.destroy());
    this._mostCommentedPresenter.clear();

    remove(this._filmSection);
    this._filmSection = null;
    remove(this._loadingElement);
    remove(this._sortView);
    this._sortView = null;
    remove(this._showMoreButton);

    if (resetFilmcardsCounter) {
      RENDERED_FILMCARDS_COUNTER = 0;
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _handleModelChange(updateType, updatedMovie) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._filmPresenter.has(updatedMovie.id)) {
          this._filmPresenter.get(updatedMovie.id).renderFilmCard(updatedMovie);
        }
        if (this._topRatedPresenter.has(updatedMovie.id)) {
          this._topRatedPresenter.get(updatedMovie.id).renderFilmCard(updatedMovie);
        }
        if (this._mostCommentedPresenter.has(updatedMovie.id)) {
          this._mostCommentedPresenter.get(updatedMovie.id).renderFilmCard(updatedMovie);
        }
        break;
      case UpdateType.MINOR:
        this.clearView({ resetFilmcardsCounter: true });
        this.renderView();
        break;
      case UpdateType.MAJOR:
        this.clearView({ resetFilmcardsCounter: true, resetSortType: true });
        this.renderView();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._filmSection);
        this.renderView();
        break;
      case UpdateType.ABORT:
        this._isLoading = false;
        remove(this._sortView);
        remove(this._filmSection);
        this._renderNoFilms();
        break;
      default:
        throw new Error('Unknown update type.');
    }
  }

  _handleViewChange(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateMovie(update)
          .then((response) => {
            this._moviesModel.updateMovie(updateType, response);
          });
        break;
      case UserAction.CHANGE_COMMENTSLIST:
        this._commentsModel.updateCommentsList(updateType, update);
        break;
      default:
        throw new Error('Unexpected user\'s action.');
    }
  }

  _resetViewAll() {
    this._filmPresenter.forEach((item) => item.resetView());
    this._topRatedPresenter.forEach((item) => item.resetView());
    this._mostCommentedPresenter.forEach((item) => item.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this.clearView({ resetFilmcardsCounter: true });
    this.renderView();
  }
}

/* eslint-disable no-underscore-dangle */
import FilmSectionView from '../view/film-section';
import RegularFilmSectionView from '../view/regular-film-section';
import FilmContainerView from '../view/film-container';
import NoMoviesView from '../view/no-movies';
import SortView from '../view/sort';
import ShowMoreButtonView from '../view/show-more-button';
import ExtraFilmSectionView from '../view/extra-film-section';
import { render, RenderPosition, remove } from '../utils/render';
import Film from './film';
import { SortType, UpdateType, UserAction } from '../utils/const';
import { sortByDate, sortByRating } from '../utils/sort';

const FILMCARDS_PER_CLICK = 5;
let RENDERED_FILMCARDS_COUNTER = 0;

export default class FilmList {
  constructor(mainContainer, moviesModel, extraMoviesModel) {
    this._mainContainer = mainContainer;
    this._moviesModel = moviesModel;
    this._sourcedFilms = moviesModel.getMovies().slice();
    this._extraMoviesModel = extraMoviesModel;

    this._currentSortType = SortType.DEFAULT;

    this._sortView = new SortView();
    this._filmSection = new FilmSectionView();
    this._regularFilmSection = new RegularFilmSectionView();
    this._filmContainer = new FilmContainerView();
    this._showMoreButton = new ShowMoreButtonView();
    this._noMoviesView = new NoMoviesView();
    this._filmPresenter = new Map();

    this._renderFiveFilmCards = this._renderFiveFilmCards.bind(this);
    this._renderMoreFilmCards = this._renderMoreFilmCards.bind(this);
    this._handleModelChange = this._handleModelChange.bind(this);
    this._resetViewAll = this._resetViewAll.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModelChange = this._handleModelChange.bind(this);
    this._handleViewChange = this._handleViewChange.bind(this);

    this._moviesModel.addObserver(this._handleModelChange);
  }

  renderView() {
    this._renderSort();
    this._renderFilmSection();
    if (this._getMovies().length === 0) {
      this._renderNoFilms();
      document.querySelector('.footer__statistics').textContent = 'There\'s no movies inside.';
      return;
    }
    this._renderFilmContainer();
    this._renderFiveFilmCards(RENDERED_FILMCARDS_COUNTER);
    if (this._getMovies().length > FILMCARDS_PER_CLICK) {
      this._renderShowMoreButton();
    }
    this._renderFirstExtraSection();
    this._renderSecondExtraSection();
    document.querySelector('.films-list--extra:last-child h2').textContent = 'Most commented';
  }

  _getMovies() {
    switch (this._currentSortType) {
      case SortType.DEFAULT:
        return this._moviesModel.getMovies().slice();
      case SortType.DATE:
        return this._moviesModel.getMovies().slice().sort(sortByDate);
      case SortType.RATING:
        return this._moviesModel.getMovies().slice().sort(sortByRating);
      default:
        throw new Error('Enexpected sort type.');
    }
  }

  _renderFilmSection() {
    render(this._mainContainer, this._filmSection);
    render(this._filmSection, this._regularFilmSection);
  }

  _renderFilmContainer() {
    render(this._regularFilmSection, this._filmContainer);
  }

  _renderSort() {
    render(this._mainContainer, this._sortView);
    this._sortView.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFiveFilmCards(counter) {
    const movies = this._getMovies();
    for (let i = counter; i < counter + FILMCARDS_PER_CLICK; i += 1) {
      this._renderFilmCard(movies[i], this._filmContainer);
      RENDERED_FILMCARDS_COUNTER += 1;
    }
  }

  _renderFilmCard(film, filmContainer) {
    const filmPresenter = new Film(filmContainer, this._handleViewChange, this._resetViewAll);
    filmPresenter.renderFilmCard(film);
    this._filmPresenter.set(film.id, filmPresenter);
  }

  _renderShowMoreButton() {
    render(this._regularFilmSection, this._showMoreButton);
    this._showMoreButton.setShowMoreClickHandler(this._renderMoreFilmCards);
  }

  _renderMoreFilmCards() {
    this._renderFiveFilmCards(RENDERED_FILMCARDS_COUNTER);
    if (RENDERED_FILMCARDS_COUNTER >= this._moviesModel.getMovies().length) {
      remove(this._showMoreButton);
    }
  }

  _renderNoFilms() {
    render(this._filmSection, this._noMoviesView, RenderPosition.AFTERBEGIN);
  }

  _renderFirstExtraSection() {
    this._extraFilmsSection1 = new ExtraFilmSectionView();
    this._extraFilmContainer1 = new FilmContainerView();
    render(this._filmSection, this._extraFilmsSection1);
    render(this._extraFilmsSection1, this._extraFilmContainer1);
    this._renderFilmCard(this._extraMoviesModel.getMovies()[0], this._extraFilmContainer1);
    this._renderFilmCard(this._extraMoviesModel.getMovies()[1], this._extraFilmContainer1);
  }

  _renderSecondExtraSection() {
    this._extraFilmsSection2 = new ExtraFilmSectionView();
    this._extraFilmContainer2 = new FilmContainerView();
    render(this._filmSection, this._extraFilmsSection2);
    render(this._extraFilmsSection2, this._extraFilmContainer2);
    this._renderFilmCard(this._extraMoviesModel.getMovies()[2], this._extraFilmContainer2);
    this._renderFilmCard(this._extraMoviesModel.getMovies()[3], this._extraFilmContainer2);
  }

  _clearFilmSection() {
    this._filmPresenter.forEach((item) => item.destroy());
    this._filmPresenter.clear();
    RENDERED_FILMCARDS_COUNTER = 0;
    remove(this._showMoreButton);
    remove(this._extraFilmsSection1);
    remove(this._extraFilmsSection2);
  }

  _handleModelChange(updateType, updatedMovie) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter.get(updatedMovie.id).renderFilmCard(updatedMovie);
        break;
      case UpdateType.MAJOR:
        this._clearFilmSection();
        this.renderView();
        break;
      default:
        throw new Error('Unknown update type.');
    }
  }

  _handleViewChange(actionType, updateType, updatedMovie) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._moviesModel.updateMovie(updateType, updatedMovie);
        break;
      default:
        throw new Error('Unexpected user\'s action.');
    }
  }

  _resetViewAll() {
    this._filmPresenter.forEach((item) => item.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearFilmSection();
    this.renderView();
  }
}
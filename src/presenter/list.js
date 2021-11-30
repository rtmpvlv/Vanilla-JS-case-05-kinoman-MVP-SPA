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
import filter from '../utils/filter';

const FILMCARDS_PER_CLICK = 5;
let RENDERED_FILMCARDS_COUNTER = 0;

export default class FilmList {
  constructor(mainContainer, moviesModel, extraMoviesModel, filterModel, commentsModel) {
    this._mainContainer = mainContainer;
    this._moviesModel = moviesModel;
    this._sourcedFilms = moviesModel.getMovies().slice();
    this._extraMoviesModel = extraMoviesModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;

    this._currentSortType = SortType.DEFAULT;

    this._sortView = null;
    this._filmSection = new FilmSectionView();
    this._regularFilmSection = new RegularFilmSectionView();
    this._filmContainer = new FilmContainerView();
    this._showMoreButton = null;
    this._noMoviesView = new NoMoviesView();
    this._filmPresenter = new Map();

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
    const filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies();
    const filteredMovies = filter[filterType](movies);

    switch (this._currentSortType) {
      case SortType.DEFAULT:
        return filteredMovies;
      case SortType.DATE:
        return filteredMovies.sort(sortByDate);
      case SortType.RATING:
        return filteredMovies.sort(sortByRating);
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
      this._renderFilmCard(movies[i], this._filmContainer);
      RENDERED_FILMCARDS_COUNTER += 1;
    }
  }

  _renderMoreFilmCards() {
    this._renderFiveFilmCards(RENDERED_FILMCARDS_COUNTER);
    if (RENDERED_FILMCARDS_COUNTER >= this._getMovies().length) {
      remove(this._showMoreButton);
    }
  }

  _renderFilmCard(film, filmContainer) {
    const filmPresenter = new Film(
      filmContainer,
      this._handleViewChange,
      this._resetViewAll,
      this._filterModel,
      this._commentsModel,
    );
    filmPresenter.renderFilmCard(film);
    this._filmPresenter.set(film.id, filmPresenter);
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

  _clearView({ resetFilmcardsCounter = false, resetSortType = false } = {}) {
    this._filmPresenter.forEach((item) => item.destroy());
    this._filmPresenter.clear();

    remove(this._sortView);
    remove(this._showMoreButton);
    remove(this._extraFilmsSection1);
    remove(this._extraFilmsSection2);

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
        this._filmPresenter.get(updatedMovie.id).renderFilmCard(updatedMovie);
        break;
      case UpdateType.MINOR:
        this._clearView({ resetFilmcardsCounter: true });
        this.renderView();
        break;
      case UpdateType.MAJOR:
        this._clearView({ resetFilmcardsCounter: true, resetSortType: true });
        this.renderView();
        break;
      default:
        throw new Error('Unknown update type.');
    }
  }

  _handleViewChange(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        try {
          this._moviesModel.updateMovie(updateType, update);
        } catch (e) {
          this._extraMoviesModel.updateMovie(updateType, update);
        }
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
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearView({ resetFilmcardsCounter: true });
    this.renderView();
  }
}

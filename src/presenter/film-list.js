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
import { updateItem } from '../mock-data/utils-and-const';

const FILMCARDS_PER_CLICK = 5;
let RENDERED_FILMCARDS_COUNTER = 0;

export default class FilmList {
  constructor(mainContainer, films, extraFilms) {
    this._mainContainer = mainContainer;
    this._films = films.slice();
    this._extraFilms = extraFilms.slice();

    this._sortView = new SortView();
    this._filmSection = new FilmSectionView();
    this._regularFilmSection = new RegularFilmSectionView();
    this._filmContainer = new FilmContainerView();
    this._showMoreButton = new ShowMoreButtonView();
    this._noMoviesView = new NoMoviesView();
    this._filmPresenter = new Map();

    this._renderFiveFilmCards = this._renderFiveFilmCards.bind(this);
    this._renderMoreFilmCards = this._renderMoreFilmCards.bind(this);
    this._changeData = this._changeData.bind(this);
    this._changeMode = this._changeMode.bind(this);
  }

  renderView() {
    this._renderSort();
    this._renderFilmSection();

    if (this._films.length === 0) {
      this._renderNoFilms();
      document.querySelector('.footer__statistics').textContent = 'There\'s no movies inside.';
    } else {
      this._renderFilmContainer();
      this._renderFiveFilmCards(RENDERED_FILMCARDS_COUNTER);
    }

    if (this._films.length > FILMCARDS_PER_CLICK) {
      this._renderShowMoreButton();
    }

    this._renderFirstExtraSection();
    this._renderSecondExtraSection();
    document.querySelector('.films-list--extra:last-child h2').textContent = 'Most commented';
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
  }

  _renderFilmCard(film, filmContainer) {
    const filmPresenter = new Film(filmContainer, this._changeData, this._changeMode);
    filmPresenter.renderFilmCard(film);
    this._filmPresenter.set(film.id, filmPresenter);
  }

  _renderFiveFilmCards(counter) {
    for (let i = counter; i < counter + FILMCARDS_PER_CLICK; i += 1) {
      this._renderFilmCard(this._films[i], this._filmContainer);
      RENDERED_FILMCARDS_COUNTER += 1;
    }
  }

  _renderShowMoreButton() {
    render(this._regularFilmSection, this._showMoreButton);
    this._showMoreButton.setShowMoreClickHandler(this._renderMoreFilmCards);
  }

  _renderMoreFilmCards() {
    this._renderFiveFilmCards(RENDERED_FILMCARDS_COUNTER);
    if (RENDERED_FILMCARDS_COUNTER >= this._films.length) {
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
    this._renderFilmCard(this._extraFilms[0], this._extraFilmContainer1);
    this._renderFilmCard(this._extraFilms[1], this._extraFilmContainer1);
  }

  _renderSecondExtraSection() {
    this._extraFilmsSection2 = new ExtraFilmSectionView();
    this._extraFilmContainer2 = new FilmContainerView();
    render(this._filmSection, this._extraFilmsSection2);
    render(this._extraFilmsSection2, this._extraFilmContainer2);
    this._renderFilmCard(this._extraFilms[2], this._extraFilmContainer2);
    this._renderFilmCard(this._extraFilms[3], this._extraFilmContainer2);
  }

  _clearFilmSection() {
    this._filmPresenter.forEach((item) => item.destroy);
    this._filmPresenter.clear();
    RENDERED_FILMCARDS_COUNTER = 0;
    remove(this._showMoreButton);
  }

  _changeData(updatedFilm) {
    this._points = updateItem(this._films, updatedFilm);
    this._filmPresenter.get(updatedFilm.id).renderFilmCard(updatedFilm);
  }

  _changeMode() {
    this._filmPresenter.forEach((item) => item.resetView());
  }
}

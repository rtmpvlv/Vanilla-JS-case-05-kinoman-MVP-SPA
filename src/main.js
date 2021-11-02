/* eslint-disable max-len */
import ProfileView from './view/profile';
import MenuView from './view/menu';
import SortView from './view/sort';
import FilmsListView from './view/films-list';
import FilmCardView from './view/film-card';
import ExtraFilmListView from './view/extra-film-list';
import FilmQuantityView from './view/film-quantity';
import PopupView from './view/popup';
import getMovieData from './mock-data/mock-data';
import setFiltering from './mock-data/filter';
import { render, RenderPosition } from './utils';

const FILMS_COUNT = 20;
const EXTRA_FILMS_COUNT = 4;
const INITIAL_ELEMENT_INDEX = 0;
const FILMS_PER_STEP = 5;

let RENDERED_FILMCARDS_COUNTER = 1;

const filmsList = new Array(FILMS_COUNT).fill().map(getMovieData);
const extraFilmList = new Array(EXTRA_FILMS_COUNT).fill().map(getMovieData);
const filters = setFiltering(filmsList);

const header = document.querySelector('.header');
const mainContent = document.querySelector('.main');

render(header, new ProfileView().getElement(), RenderPosition.BEFOREEND);
render(mainContent, new MenuView(filters).getElement(), RenderPosition.AFTERBEGIN);
render(mainContent, new SortView().getElement(), RenderPosition.BEFOREEND);

const films = document.createElement('section');
films.classList.add('films');
mainContent.appendChild(films);
render(films, new FilmsListView().getElement(), RenderPosition.BEFOREEND);

const filmsListContainer = document.querySelector('.films-list__container');
const showMoreButton = document.querySelector('.films-list__show-more');
showMoreButton.classList.add('hidden');

const renderFilmCard = (place, film) => {
  const filmCard = new FilmCardView(film);
  const popup = new PopupView(film);

  const openPopup = () => {
    document.body.classList.add('hide-overflow');
    document.body.appendChild(popup.getElement());
  };

  const closePopup = () => {
    document.body.classList.remove('hide-overflow');
    document.body.removeChild(popup.getElement());
  };

  filmCard.getElement().querySelector('.film-card img').addEventListener('click', openPopup);
  filmCard.getElement().querySelector('.film-card h3').addEventListener('click', openPopup);
  filmCard.getElement().querySelector('.film-card a').addEventListener('click', openPopup);
  popup.getElement().querySelector('.film-details__close-btn').addEventListener('click', closePopup);

  render(place, filmCard.getElement(), RenderPosition.BEFOREEND);
};

const renderFiveFilmCards = (j) => {
  for (let i = j; i < j + FILMS_PER_STEP; i += 1) {
    if (filmsList[i]) {
      renderFilmCard(filmsListContainer, filmsList[i]);
      RENDERED_FILMCARDS_COUNTER += 1;
    }
  }
};
renderFiveFilmCards(INITIAL_ELEMENT_INDEX);
const rerenderFilmCards = () => {
  renderFiveFilmCards(RENDERED_FILMCARDS_COUNTER);
  if (RENDERED_FILMCARDS_COUNTER >= filmsList.length) {
    showMoreButton.classList.add('hidden');
    showMoreButton.removeEventListener('click', rerenderFilmCards);
  }
};
if (filmsList.length > FILMS_PER_STEP) {
  showMoreButton.classList.remove('hidden');
  showMoreButton.addEventListener('click', rerenderFilmCards);
}

render(films, new ExtraFilmListView().getElement(), RenderPosition.BEFOREEND);
render(films, new ExtraFilmListView().getElement(), RenderPosition.BEFOREEND);
const extraSection1 = films.querySelector('.films-list--extra:nth-child(2)');
const extraSection2 = films.querySelector('.films-list--extra:last-child');
extraSection2.querySelector('h2').textContent = 'Most commented';
const filmsListContainerExtra1 = extraSection1.querySelector('.films-list__container');
const filmsListContainerExtra2 = extraSection2.querySelector('.films-list__container');
renderFilmCard(filmsListContainerExtra1, extraFilmList[0]);
renderFilmCard(filmsListContainerExtra1, extraFilmList[1]);
renderFilmCard(filmsListContainerExtra2, extraFilmList[2]);
renderFilmCard(filmsListContainerExtra2, extraFilmList[3]);

const footerStatistics = document.querySelector('.footer__statistics');
render(footerStatistics, new FilmQuantityView().getElement(), RenderPosition.BEFOREEND);

import createProfileTemplate from './view/profile';
import createMenuTemplate from './view/menu';
import createSortTemplate from './view/sort';
import createFilmsListTemplate from './view/films-list';
import createFilmsCardTemplate from './view/film-card';
import createFilmsListExtraTemplate from './view/extra-film-list';
import createFilmsQuantityTemplate from './view/film-quantity';
import createPopupTemplate from './view/popup';
import getMovieData from './mock-data/mock-data';
import setFiltering from './mock-data/filter';

const FILMS_COUNT = 20;
const EXTRA_FILMS_COUNT = 4;
const FILMS_PER_STEP = 5;
const INSERT_PLACE = 'beforeend';

let RENDERED_FILMCARDS_COUNTER = 1;

const filmsList = new Array(FILMS_COUNT).fill().map(getMovieData);
const extraFilmList = new Array(EXTRA_FILMS_COUNT).fill().map(getMovieData);
const filters = setFiltering(filmsList);

const header = document.querySelector('.header');
const mainContent = document.querySelector('.main');

const render = (container, template, place = INSERT_PLACE) => {
  container.insertAdjacentHTML(place, template);
};

render(header, createProfileTemplate());
render(mainContent, createMenuTemplate(filters), 'afterbegin');
render(mainContent, createSortTemplate());

const films = document.createElement('section');
films.classList.add('films');
mainContent.appendChild(films);
render(films, createFilmsListTemplate());

const filmsListContainer = document.querySelector('.films-list__container');
const showMoreButton = document.querySelector('.films-list__show-more');

showMoreButton.classList.add('hidden');
const renderFiveFilmCards = (j) => {
  for (let i = j; i < j + FILMS_PER_STEP; i += 1) {
    if (filmsList[i]) {
      render(filmsListContainer, createFilmsCardTemplate(filmsList[i]));
      RENDERED_FILMCARDS_COUNTER += 1;
    }
  }
};
renderFiveFilmCards(1);
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

render(films, createFilmsListExtraTemplate());
render(films, createFilmsListExtraTemplate());
const extraSection1 = films.querySelector('.films-list--extra:nth-child(2)');
const extraSection2 = films.querySelector('.films-list--extra:last-child');
extraSection2.querySelector('h2').textContent = 'Most commented';
const filmsListContainerExtra1 = extraSection1.querySelector('.films-list__container');
const filmsListContainerExtra2 = extraSection2.querySelector('.films-list__container');
render(filmsListContainerExtra1, createFilmsCardTemplate(extraFilmList[0]));
render(filmsListContainerExtra1, createFilmsCardTemplate(extraFilmList[1]));
render(filmsListContainerExtra2, createFilmsCardTemplate(extraFilmList[2]));
render(filmsListContainerExtra2, createFilmsCardTemplate(extraFilmList[3]));

const footerStatistics = document.querySelector('.footer__statistics');
render(footerStatistics, createFilmsQuantityTemplate());

render(document.body, createPopupTemplate(filmsList[0]));

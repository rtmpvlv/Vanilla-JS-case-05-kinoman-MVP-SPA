import createProfileTemplate from './view/profile';
import createMenuTemplate from './view/menu';
import createSortTemplate from './view/sort';
import createFilmsListTemplate from './view/films-list';
import createFilmsCardTemplate from './view/film-card';
import createFilmsListExtraTemplate from './view/extra-film-list';
import createFilmsQuantityTemplate from './view/film-quantity';
// import createPopupTemplate from './view/popup';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const header = document.querySelector('.header');
const mainContent = document.querySelector('.main');

render(header, createProfileTemplate(), 'beforeend');
render(mainContent, createMenuTemplate(), 'afterbegin');
render(mainContent, createSortTemplate(), 'beforeend');

const films = document.createElement('section');
films.classList.add('films');
mainContent.appendChild(films);

render(films, createFilmsListTemplate(), 'beforeend');

const filmsListContainer = document.querySelector('.films-list__container');
render(filmsListContainer, createFilmsCardTemplate(), 'beforeend');
render(filmsListContainer, createFilmsCardTemplate(), 'beforeend');
render(filmsListContainer, createFilmsCardTemplate(), 'beforeend');
render(filmsListContainer, createFilmsCardTemplate(), 'beforeend');
render(filmsListContainer, createFilmsCardTemplate(), 'beforeend');

render(films, createFilmsListExtraTemplate(), 'beforeend');
render(films, createFilmsListExtraTemplate(), 'beforeend');

const extraSection1 = films.querySelector('.films-list--extra:nth-child(2)');
const extraSection2 = films.querySelector('.films-list--extra:last-child');
extraSection2.querySelector('h2').textContent = 'Most commented';

const filmsListContainerExtra1 = extraSection1.querySelector('.films-list__container');
const filmsListContainerExtra2 = extraSection2.querySelector('.films-list__container');

render(filmsListContainerExtra1, createFilmsCardTemplate(), 'beforeend');
render(filmsListContainerExtra1, createFilmsCardTemplate(), 'beforeend');
render(filmsListContainerExtra2, createFilmsCardTemplate(), 'beforeend');
render(filmsListContainerExtra2, createFilmsCardTemplate(), 'beforeend');

const footerStatistics = document.querySelector('.footer__statistics');
render(footerStatistics, createFilmsQuantityTemplate(), 'beforeend');

// render(document.body, createPopupTemplate(), 'beforeend');

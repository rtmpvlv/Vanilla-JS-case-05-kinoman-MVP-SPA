/* eslint-disable max-len */
import ProfileView from './view/profile';
import MenuView from './view/menu';
import SortView from './view/sort';
import FilmsListView from './view/films-list';
import FilmCardView from './view/film-card';
import NoMoviesView from './view/no-movies';
import ExtraFilmListView from './view/extra-film-list';
import FilmQuantityView from './view/film-quantity';
import PopupView from './view/popup';
import getMovieData from './mock-data/mock-data';
import setFiltering from './mock-data/filter';
import { render, RenderPosition } from './utils';

const FILMCARDS_QUANTITY = 20;
const EXTRA_FILMCARDS_QUANTITY = 4;
const FILMCARDS_PER_CLICK = 5;

let RENDERED_FILMCARDS_COUNTER = 0;

const filmsList = new Array(FILMCARDS_QUANTITY).fill().map(getMovieData);
const extraFilmList = new Array(EXTRA_FILMCARDS_QUANTITY).fill().map(getMovieData);
const filters = setFiltering(filmsList);

const header = document.querySelector('.header');
const mainContent = document.querySelector('.main');

render(mainContent, new MenuView(filters).getElement(), RenderPosition.AFTERBEGIN);

const renderView = (films, extraFilms) => {
  const filmsSection = document.createElement('section');
  filmsSection.classList.add('films');

  if (!films || films.length === 0) {
    mainContent.appendChild(filmsSection);
    render(filmsSection, new NoMoviesView().getElement(), RenderPosition.BEFOREEND);
    render(document.querySelector('.footer__statistics'), '0 movies inside', RenderPosition.BEFOREEND);
  } else {
    render(header, new ProfileView().getElement(), RenderPosition.BEFOREEND);
    render(mainContent, new SortView().getElement(), RenderPosition.BEFOREEND);
    mainContent.appendChild(filmsSection);
    render(filmsSection, new FilmsListView().getElement(), RenderPosition.BEFOREEND);

    const filmsListContainer = document.querySelector('.films-list__container');
    const showMoreButton = document.querySelector('.films-list__show-more');
    showMoreButton.classList.add('hidden');

    const renderFilmCard = (place, film) => {
      const filmCard = new FilmCardView(film);
      const popup = new PopupView(film);

      const keyPressed = (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          document.body.classList.remove('hide-overflow');
          document.body.removeChild(popup.getElement());
          document.removeEventListener('keydown', keyPressed);
        }
      };

      const closePopup = () => {
        document.body.classList.remove('hide-overflow');
        document.body.removeChild(popup.getElement());
        document.removeEventListener('keydown', keyPressed);
      };

      const openPopup = () => {
        document.body.classList.add('hide-overflow');
        document.body.appendChild(popup.getElement());
        document.addEventListener('keydown', keyPressed);
      };

      filmCard.getElement().querySelector('.film-card img').addEventListener('click', openPopup);
      filmCard.getElement().querySelector('.film-card h3').addEventListener('click', openPopup);
      filmCard.getElement().querySelector('.film-card a').addEventListener('click', openPopup);
      popup.getElement().querySelector('.film-details__close-btn').addEventListener('click', closePopup);

      render(place, filmCard.getElement(), RenderPosition.BEFOREEND);
    };

    const renderFiveFilmCards = (counter) => {
      for (let i = counter; i < counter + FILMCARDS_PER_CLICK; i += 1) {
        renderFilmCard(filmsListContainer, filmsList[i]);
        RENDERED_FILMCARDS_COUNTER += 1;
      }
    };
    renderFiveFilmCards(RENDERED_FILMCARDS_COUNTER);

    const rerenderFilmCards = () => {
      renderFiveFilmCards(RENDERED_FILMCARDS_COUNTER);
      if (RENDERED_FILMCARDS_COUNTER >= filmsList.length) {
        showMoreButton.classList.add('hidden');
        showMoreButton.removeEventListener('click', rerenderFilmCards);
      }
    };

    if (filmsList.length > FILMCARDS_PER_CLICK) {
      showMoreButton.classList.remove('hidden');
      showMoreButton.addEventListener('click', rerenderFilmCards);
    }

    render(filmsSection, new ExtraFilmListView().getElement(), RenderPosition.BEFOREEND);
    render(filmsSection, new ExtraFilmListView().getElement(), RenderPosition.BEFOREEND);
    const extraSection1 = filmsSection.querySelector('.films-list--extra:nth-child(2)');
    const extraSection2 = filmsSection.querySelector('.films-list--extra:last-child');
    extraSection2.querySelector('h2').textContent = 'Most commented';
    const filmsListContainerExtra1 = extraSection1.querySelector('.films-list__container');
    const filmsListContainerExtra2 = extraSection2.querySelector('.films-list__container');
    renderFilmCard(filmsListContainerExtra1, extraFilms[0]);
    renderFilmCard(filmsListContainerExtra1, extraFilms[1]);
    renderFilmCard(filmsListContainerExtra2, extraFilms[2]);
    renderFilmCard(filmsListContainerExtra2, extraFilms[3]);

    const footerStatistics = document.querySelector('.footer__statistics');
    render(footerStatistics, new FilmQuantityView().getElement(), RenderPosition.BEFOREEND);
  }
};
renderView(filmsList, extraFilmList);

import ProfileView from './view/profile';
import MenuView from './view/menu';
import FilmQuantityView from './view/film-quantity';
import getMovieData from './mock-data/mock-data';
import setFiltering from './mock-data/filter';
import { render, RenderPosition } from './utils/render';
import FilmListPresenter from './presenter/film-list';

const FILMCARDS_QUANTITY = 20;
const EXTRA_FILMCARDS_QUANTITY = 4;

const filmsList = new Array(FILMCARDS_QUANTITY).fill().map(getMovieData);
const extraFilmList = new Array(EXTRA_FILMCARDS_QUANTITY).fill().map(getMovieData);
const filters = setFiltering(filmsList);

const header = document.querySelector('.header');
const mainContent = document.querySelector('.main');

const filmListPresenter = new FilmListPresenter(mainContent, filmsList, extraFilmList);

render(mainContent, new MenuView(filters), RenderPosition.AFTERBEGIN);

if (filmsList.length !== 0) {
  render(header, new ProfileView());
  const footerStatistics = document.querySelector('.footer__statistics');
  render(footerStatistics, new FilmQuantityView());
}
filmListPresenter.renderView();

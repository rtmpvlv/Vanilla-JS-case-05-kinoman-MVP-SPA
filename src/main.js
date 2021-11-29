import ProfileView from './view/profile';
import MenuView from './view/menu';
import FilmQuantityView from './view/film-quantity';
import getMovieData from './mock-data/mock-data';
import setFiltering from './mock-data/filter';
import { render, RenderPosition } from './utils/render';
import FilmListPresenter from './presenter/list';
import MoviesModel from './model/movies';
import ExtraMoviesModel from './model/extra-movies';

const FILMCARDS_QUANTITY = 20;
const EXTRA_FILMCARDS_QUANTITY = 4;

const films = new Array(FILMCARDS_QUANTITY).fill().map(getMovieData);
const extraFilmList = new Array(EXTRA_FILMCARDS_QUANTITY).fill().map(getMovieData);
const filters = setFiltering(films);

const header = document.querySelector('.header');
const mainContent = document.querySelector('.main');

const moviesModel = new MoviesModel();
const extraMoviesModel = new ExtraMoviesModel();
moviesModel.setMovies(films);
extraMoviesModel.setMovies(extraFilmList);
const filmListPresenter = new FilmListPresenter(mainContent, moviesModel, extraMoviesModel);

render(mainContent, new MenuView(filters), RenderPosition.AFTERBEGIN);

if (films.length !== 0) {
  render(header, new ProfileView());
  const footerStatistics = document.querySelector('.footer__statistics');
  render(footerStatistics, new FilmQuantityView());
}
filmListPresenter.renderView();

// 53:21

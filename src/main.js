import MoviesModel from './model/movies';
import ExtraMoviesModel from './model/extra-movies';
import FilterModel from './model/filter';
import CommentsModel from './model/comments';
import ProfileView from './view/profile';
import FilmQuantityView from './view/film-quantity';
import FilmListPresenter from './presenter/list';
import MenuPresenter from './presenter/filter';
import { render } from './utils/render';
import getMovieData from './mock-data/mock-data';

const FILMCARDS_QUANTITY = 20;
const EXTRA_FILMCARDS_QUANTITY = 4;

const films = new Array(FILMCARDS_QUANTITY).fill().map(getMovieData);
const extraFilmList = new Array(EXTRA_FILMCARDS_QUANTITY).fill().map(getMovieData);

const header = document.querySelector('.header');
const mainContent = document.querySelector('.main');

const moviesModel = new MoviesModel();
const extraMoviesModel = new ExtraMoviesModel();
const commentsModel = new CommentsModel();
moviesModel.setMovies(films);
extraMoviesModel.setMovies(extraFilmList);
commentsModel.setComments(films.map((film) => film.comments));
const filterModel = new FilterModel();
const filmListPresenter = new FilmListPresenter(
  mainContent,
  moviesModel,
  extraMoviesModel,
  filterModel,
  commentsModel,
);
const menuPresenter = new MenuPresenter(mainContent, filterModel, moviesModel);
menuPresenter.init();

if (films.length !== 0) {
  render(header, new ProfileView());
  const footerStatistics = document.querySelector('.footer__statistics');
  render(footerStatistics, new FilmQuantityView());
}
filmListPresenter.renderView();

// 53:21

import MoviesModel from './model/movies';
import ExtraMoviesModel from './model/extra-movies';
import FilterModel from './model/filter';
import CommentsModel from './model/comments';
import FilmQuantityView from './view/film-quantity';
import FilmListPresenter from './presenter/list';
import MenuPresenter from './presenter/menu';
import StatsPresenter from './presenter/stats';
import ProfilePresenter from './presenter/profile';
import { render } from './utils/render';
import { FilterType, UpdateType } from './utils/const';
import getMovieData from './mock-data/mock-data';

const FILMCARDS_QUANTITY = 20;
const EXTRA_FILMCARDS_QUANTITY = 4;

const films = new Array(FILMCARDS_QUANTITY).fill().map(getMovieData);
const extraFilmList = new Array(EXTRA_FILMCARDS_QUANTITY).fill().map(getMovieData);

const header = document.querySelector('.header');
const main = document.querySelector('.main');

const moviesModel = new MoviesModel();
const extraMoviesModel = new ExtraMoviesModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();
moviesModel.setMovies(films);
extraMoviesModel.setMovies(extraFilmList);
commentsModel.setComments(films.map((film) => film.comments));
const filmListPresenter = new FilmListPresenter(
  main,
  moviesModel,
  extraMoviesModel,
  filterModel,
  commentsModel,
);

const profilePresenter = new ProfilePresenter(header, moviesModel);

if (films.length !== 0) {
  profilePresenter.init();
  const footerStatistics = document.querySelector('.footer__statistics');
  render(footerStatistics, new FilmQuantityView());
}
filmListPresenter.renderView();

const statsPresenter = new StatsPresenter(main, moviesModel);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case FilterType.ALL:
    case FilterType.WATCHLIST:
    case FilterType.HISTORY:
    case FilterType.FAVORITES:
      if (statsPresenter !== null) {
        statsPresenter.destroy();
      }
      filterModel.setFilter(UpdateType.MAJOR, menuItem);
      break;
    case 'stats':
      filmListPresenter.clearView({ resetFilmcardsCounter: true, resetSortType: true });
      statsPresenter.render();
      break;
    default:
      throw new Error('Unexpected menu item.');
  }
};

const menuPresenter = new MenuPresenter(main, filterModel, moviesModel, handleSiteMenuClick);
menuPresenter.init();

// Разобраться с обновлением листа

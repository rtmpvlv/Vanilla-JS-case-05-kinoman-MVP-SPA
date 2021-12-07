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
import { FilterType, UpdateType, APIDataType } from './utils/const';
import Api from './api';

const AUTHORIZATION = 'Basic rtmpvlv';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const header = document.querySelector('.header');
const main = document.querySelector('.main');

const moviesModel = new MoviesModel();
const extraMoviesModel = new ExtraMoviesModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();
const api = new Api(END_POINT, AUTHORIZATION);
const filmListPresenter = new FilmListPresenter(
  main,
  moviesModel,
  extraMoviesModel,
  filterModel,
  commentsModel,
  api,
);
const profilePresenter = new ProfilePresenter(header, moviesModel);
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
filmListPresenter.renderView();
const footerStatistics = document.querySelector('.footer__statistics');
render(footerStatistics, new FilmQuantityView());

api.getData(APIDataType.MOVIES)
  .then((movies) => {
    moviesModel.setMovies(UpdateType.INIT, movies);
    footerStatistics.textContent = `${moviesModel.getMovies().length} movies inside`;
    profilePresenter.init();
  })
  .catch(() => {
    moviesModel.setMovies(UpdateType.ABORT, []);
  });

// Функция сортировки по рейтингу косячит

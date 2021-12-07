/* eslint-disable max-len */
import dayjs from 'dayjs';

export const sortByDate = (film1, film2) => dayjs(film2.filmInfo.release.date).diff(dayjs(film1.filmInfo.release.date));
export const sortByRating = (film1, film2) => film2.filmInfo.totalRating - film1.filmInfo.totalRating;
export const sortByCommentsLength = (film1, film2) => film2.comments.length - film1.comments.length;
export const calcWatchedMovies = (movies) => {
  const watchedMovies = movies.filter((movie) => movie.userDetails.alreadyWatched);
  const watched = watchedMovies.length;

  const getRank = () => {
    if (watched >= 1 && watched <= 10) {
      return 'Novice';
    }
    if (watched >= 11 && watched <= 20) {
      return 'Fan';
    }
    if (watched >= 21) {
      return 'Movie buff';
    }
    return '';
  };

  const convertRuntime = () => {
    const watchedMoviesRuntime = watchedMovies
      .reduce((sum, current) => sum + current.filmInfo.runtime, 0);
    const mins = watchedMoviesRuntime % 60;
    const hours = (watchedMoviesRuntime / 60).toFixed(0);
    return [hours, mins];
  };

  let types = [];
  watchedMovies.forEach((movie) => movie.filmInfo.genre.forEach((item) => types.push(item)));
  types = Array.from(new Set(types));

  let sortedMovies = types
    .map((type) => watchedMovies.filter((movie) => movie.filmInfo.genre.includes(type)))
    .map((element) => element.length);

  const arr = [];
  for (let i = 0; i < types.length; i += 1) {
    arr.push([types[i], sortedMovies[i]]);
  }

  arr.sort((a, b) => b[1] - a[1]);
  types = arr.map((item) => item[0]);
  sortedMovies = arr.map((item) => item[1]);

  return {
    watched,
    rank: getRank(),
    runtimeHours: convertRuntime()[0],
    runtimeMins: convertRuntime()[1],
    types,
    sortedMovies,
  };
};

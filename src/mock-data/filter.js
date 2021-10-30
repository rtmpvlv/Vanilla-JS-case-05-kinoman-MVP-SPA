const filmFilterMap = {
  // All: (films) => films,
  Watchlist: (films) => films.filter((film) => film.userDetails.watchList).length,
  History: (films) => films.filter((film) => film.userDetails.alreadyWatched).length,
  Favorites: (films) => films.filter((film) => film.userDetails.favorite).length,
};

const setFiltering = (films) => Object.entries(filmFilterMap).map(
  ([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  }),
);

export default setFiltering;

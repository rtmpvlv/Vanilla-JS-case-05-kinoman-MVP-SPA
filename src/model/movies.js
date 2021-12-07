/* eslint-disable prefer-object-spread */
/* eslint-disable no-underscore-dangle */
import AbstractObserver from '../utils/abstract-observer';

export default class Movies extends AbstractObserver {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(updateType, movies) {
    this._movies = movies.slice();
    this._notify(updateType);
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addMovie(updateType, update) {
    this._movies = [
      update,
      ...this._movies,
    ];

    this._notify(updateType, update);
  }

  deleteMovie(updateType, update) {
    const index = this._movies.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting movie');
    }

    this._movies.splice(index, 1);
    this._notify(updateType);
  }

  static adaptToClient(movie) {
    const adaptedData = Object.assign(
      {},
      movie,
      {
        filmInfo: {
          title: movie.film_info.title,
          alternativeTitle: movie.film_info.alternative_title,
          totalRating: movie.film_info.total_rating,
          poster: movie.film_info.poster,
          ageRating: movie.film_info.age_rating,
          director: movie.film_info.director,
          writers: movie.film_info.writers,
          actors: movie.film_info.actors,
          release: {
            date: new Date(movie.film_info.release.date),
            country: movie.film_info.release.release_country,
          },
          runtime: movie.film_info.runtime,
          genre: movie.film_info.genre,
          description: movie.film_info.description,
        },
      },
      {
        userDetails: {
          alreadyWatched: movie.user_details.already_watched,
          watchingDate: movie.user_details.watching_date !== undefined
            ? new Date(movie.user_details.watching_date) : false,
          favorite: movie.user_details.favorite,
          watchList: movie.user_details.watchlist,
        },
      },
    );

    delete adaptedData.film_info;
    delete adaptedData.user_details;
    return adaptedData;
  }

  static adaptToServer(movie) {
    const watchingDate = () => {
      if (!movie.userDetails.watchingDate
        || movie.userDetails.watchingDate === null
        || movie.userDetails.watchingDate === undefined
      ) {
        return null;
      }
      return movie.userDetails.watchingDate.toISOString();
    };
    const adaptedData = Object.assign(
      {},
      movie,
      {
        film_info: {
          title: movie.filmInfo.title,
          alternative_title: movie.filmInfo.alternativeTitle,
          total_rating: movie.filmInfo.totalRating,
          poster: movie.filmInfo.poster,
          age_rating: movie.filmInfo.ageRating,
          director: movie.filmInfo.director,
          writers: movie.filmInfo.writers,
          actors: movie.filmInfo.actors,
          release: {
            date: movie.filmInfo.release.date.toISOString(),
            release_country: movie.filmInfo.release.country,
          },
          runtime: movie.filmInfo.runtime,
          genre: movie.filmInfo.genre,
          description: movie.filmInfo.description,
        },
      },
      {
        user_details: {
          already_watched: movie.userDetails.alreadyWatched,
          watching_date: watchingDate(),
          favorite: movie.userDetails.favorite,
          watchlist: movie.userDetails.watchList,
        },
      },
    );

    delete adaptedData.filmInfo;
    delete adaptedData.userDetails;
    return adaptedData;
  }
}

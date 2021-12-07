/* eslint-disable no-underscore-dangle */
import MoviesModel from './model/movies';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getData(type) {
    return this._load({ url: type })
      .then(Api.toJSON)
      .then((data) => data.map(MoviesModel.adaptToClient));
  }

  getComments(movie) {
    return this._load({ url: `comments/${movie.id}` })
      .then(Api.toJSON);
  }

  updateMovie(movie) {
    return this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(MoviesModel.adaptToServer(movie)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON)
      .then(MoviesModel.adaptToClient);
  }

  addComment(movie) {
    return this._load({
      url: `comments/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify(movie.comment),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON)
      .then((response) => MoviesModel.adaptToClient(response.movie));
  }

  deleteComment(movie) {
    return this._load({
      url: `comments/${movie.deletedCommentID}`,
      method: Method.DELETE,
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      { method, body, headers },
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN || response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}

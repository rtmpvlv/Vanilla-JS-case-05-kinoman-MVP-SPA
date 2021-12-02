/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
import ProfileView from '../view/profile';
import { render, replace, remove } from '../utils/render';

export default class Profile {
  constructor(place, moviesModel) {
    this._place = place;
    this._moviesModel = moviesModel;

    this._profileView = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._moviesModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevProfileView = this._profileView;
    this._profileView = new ProfileView(this._moviesModel.getMovies());

    if (prevProfileView === null) {
      render(this._place, this._profileView);
      return;
    }

    replace(this._profileView, prevProfileView);
    remove(prevProfileView);
  }

  _handleModelEvent() {
    this.init();
  }
}

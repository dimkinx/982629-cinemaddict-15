import FilmView from '../view/film-view';
import {render, replace, remove} from '../utils/dom-utils';

export default class FilmPresenter {
  constructor(filmListContainer, openPopup, changeData) {
    this._filmListContainer = filmListContainer;
    this._openPopup = openPopup;
    this._changeData = changeData;

    this._filmComponent = null;

    this._handleOpenFilmDetails = this._handleOpenFilmDetails.bind(this);
  }

  init(film) {
    this._film = film;

    const previous = this._filmComponent;
    this._filmComponent = new FilmView(this._film, this._changeData);
    this._filmComponent.setOpenFilmDetailsClickHandler(this._handleOpenFilmDetails);

    if (previous === null) {
      render(this._filmListContainer, this._filmComponent);
      return;
    }

    if (this._filmListContainer.contains(previous.getElement())) {
      replace(this._filmComponent, previous);
    }

    remove(previous);
  }

  destroy() {
    remove(this._filmComponent);
    this._filmComponent = null;
  }

  _handleOpenFilmDetails() {
    this._openPopup(this._film);
  }
}

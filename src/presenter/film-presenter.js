import FilmView from '../view/film-view';
import FilmDetailsView from '../view/film-details-view';
import {RenderPlace, render, remove, isEscEvent} from '../utils/dom-utils';

export default class FilmPresenter {
  constructor(filmListContainer, footerContainer) {
    this._filmListContainer = filmListContainer;
    this._footerContainer = footerContainer;

    this._handleOpenFilmDetailsClick = this._handleOpenFilmDetailsClick.bind(this);
    this._handleCloseFilmDetailsClick = this._handleCloseFilmDetailsClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;
    this._filmComponent = new FilmView(this._film);
    this._filmDetailsComponent = new FilmDetailsView(this._film, this._comments);

    this._renderFilm();
  }

  _handleOpenFilmDetailsClick() {
    document.addEventListener('keydown', this._escKeyDownHandler);
    document.body.classList.add('hide-overflow');

    this._renderFilmDetails();
  }

  _handleCloseFilmDetailsClick() {
    document.body.classList.remove('hide-overflow');

    remove(this._filmDetailsComponent);
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      document.removeEventListener('keydown', this._escKeyDownHandler);

      this._handleCloseFilmDetailsClick();
    }
  }

  _renderFilm() {
    render(this._filmListContainer, this._filmComponent);
    this._filmComponent.setOpenFilmDetailsClickHandler(this._handleOpenFilmDetailsClick);
  }

  _renderFilmDetails() {
    render(this._footerContainer, this._filmDetailsComponent, RenderPlace.AFTER_END);
    this._filmDetailsComponent.setCloseFilmDetailsClickHandler(this._handleCloseFilmDetailsClick);
  }
}

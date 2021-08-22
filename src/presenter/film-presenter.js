import FilmView from '../view/film-view';
import FilmDetailsView from '../view/film-details-view';
import {render, replace, remove, isEscEvent} from '../utils/dom-utils';

export default class FilmPresenter {
  constructor(filmListContainer, changeData) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._filmComponent = null;
    this._filmDetailsComponent = null;

    this._handleOpenFilmDetailsClick = this._handleOpenFilmDetailsClick.bind(this);
    this._handleCloseFilmDetailsClick = this._handleCloseFilmDetailsClick.bind(this);
    this._handleWatchlistButtonClick = this._handleWatchlistButtonClick.bind(this);
    this._handleWatchedButtonClick = this._handleWatchedButtonClick.bind(this);
    this._handleFavoriteButtonClick = this._handleFavoriteButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;

    const previous = this._filmComponent;
    this._filmComponent = new FilmView(this._film);
    this._filmComponent.setOpenFilmDetailsClickHandler(this._handleOpenFilmDetailsClick);
    this._filmComponent.setWatchlistButtonClickHandler(this._handleWatchlistButtonClick);
    this._filmComponent.setWatchedButtonClickHandler(this._handleWatchedButtonClick);
    this._filmComponent.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);

    if (previous === null) {
      this._renderFilm();
      return;
    }

    replace(this._filmComponent, previous);
    remove(previous);

    this._replaceFilmDetails();
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
    this._filmComponent = null;
    this._filmDetailsComponent = null;
  }

  _renderFilm() {
    render(this._filmListContainer, this._filmComponent);
  }

  _initFilmDetails() {
    this._filmDetailsComponent = new FilmDetailsView(this._film, this._comments);
    this._filmDetailsComponent.setCloseFilmDetailsClickHandler(this._handleCloseFilmDetailsClick);
    this._filmDetailsComponent.setWatchlistButtonClickHandler(this._handleWatchlistButtonClick);
    this._filmDetailsComponent.setWatchedButtonClickHandler(this._handleWatchedButtonClick);
    this._filmDetailsComponent.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);
  }

  _replaceFilmDetails() {
    const previous = this._filmDetailsComponent;

    if (previous) {
      this._initFilmDetails();
      replace(this._filmDetailsComponent, previous);
      remove(previous);
    }
  }

  _renderFilmDetails() {
    this._initFilmDetails();
    render(document.body, this._filmDetailsComponent);
  }

  _handleOpenFilmDetailsClick() {
    const filmDetailsElement = document.body.querySelector('.film-details');

    if (filmDetailsElement) {
      filmDetailsElement.remove();
      this._handleCloseFilmDetailsClick();
    }

    if (this._filmDetailsComponent === null) {
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this._escKeyDownHandler);
      this._renderFilmDetails();
    }
  }

  _handleCloseFilmDetailsClick() {
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    remove(this._filmDetailsComponent);
    this._filmDetailsComponent = null;
  }

  _handleWatchlistButtonClick() {
    this._changeData(Object.assign({}, this._film, {userDetails: {
      ...this._film.userDetails,
      watchlist: !this._film.userDetails.watchlist,
    }}));
  }

  _handleWatchedButtonClick() {
    this._changeData(Object.assign({}, this._film, {userDetails: {
      ...this._film.userDetails,
      alreadyWatched: !this._film.userDetails.alreadyWatched,
    }}));
  }

  _handleFavoriteButtonClick() {
    this._changeData(Object.assign({}, this._film, {userDetails: {
      ...this._film.userDetails,
      favorite: !this._film.userDetails.favorite,
    }}));
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._handleCloseFilmDetailsClick();
    }
  }
}

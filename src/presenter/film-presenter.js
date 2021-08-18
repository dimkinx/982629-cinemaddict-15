import FilmView from '../view/film-view';
import {render, replace, remove} from '../utils/dom-utils';

export default class FilmPresenter {
  constructor(filmListContainer, changeData, openModal) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._openModal = openModal;
    this._filmComponent = null;

    this._handleOpenFilmDetailsClick = this._handleOpenFilmDetailsClick.bind(this);
    this._handleWatchlistButtonClick = this._handleWatchlistButtonClick.bind(this);
    this._handleWatchedButtonClick = this._handleWatchedButtonClick.bind(this);
    this._handleFavoriteButtonClick = this._handleFavoriteButtonClick.bind(this);
  }

  init(film) {
    this._film = film;

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
  }

  _renderFilm() {
    render(this._filmListContainer, this._filmComponent);
  }

  destroy() {
    remove(this._filmComponent);
  }

  _handleOpenFilmDetailsClick() {
    document.body.classList.add('hide-overflow');
    this._openModal(this._film);
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
}

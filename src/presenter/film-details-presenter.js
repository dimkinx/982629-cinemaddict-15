import FilmDetailsView from '../view/film-details-view';
import {RenderPlace, render, replace, remove} from '../utils/dom-utils';

export default class FilmDetailsPresenter {
  constructor(footerContainer, changeData, closeModal) {
    this._footerContainer = footerContainer;
    this._changeData = changeData;
    this._closeModal = closeModal;
    this._filmDetailsComponent = null;

    this._handleCloseFilmDetailsClick = this._handleCloseFilmDetailsClick.bind(this);
    this._handleWatchlistButtonClick = this._handleWatchlistButtonClick.bind(this);
    this._handleWatchedButtonClick = this._handleWatchedButtonClick.bind(this);
    this._handleFavoriteButtonClick = this._handleFavoriteButtonClick.bind(this);
  }

  init(film, comments) {
    this._film = film;

    const previous = this._filmDetailsComponent;
    this._filmDetailsComponent = new FilmDetailsView(this._film, comments);
    this.id = this._filmDetailsComponent._film.id;
    this._filmDetailsComponent.setCloseFilmDetailsClickHandler(this._handleCloseFilmDetailsClick);
    this._filmDetailsComponent.setWatchlistButtonClickHandler(this._handleWatchlistButtonClick);
    this._filmDetailsComponent.setWatchedButtonClickHandler(this._handleWatchedButtonClick);
    this._filmDetailsComponent.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);

    if (previous === null) {
      this._renderFilmDetails();
      return;
    }

    replace(this._filmDetailsComponent, previous);
    remove(previous);
  }

  destroy() {
    remove(this._filmDetailsComponent);
  }

  _renderFilmDetails() {
    render(this._footerContainer, this._filmDetailsComponent, RenderPlace.AFTER_END);
  }

  _handleCloseFilmDetailsClick() {
    this._closeModal();
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
}

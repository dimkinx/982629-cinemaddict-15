import {getFormattedDate, getFormattedDuration} from '../utils/date-time-utils';
import {addActiveModifier} from '../utils/dom-utils';
import AbstractView from './abstract-view';

const MAX_LENGTH_DESCRIPTION = 140;

const trimText = (text, length = MAX_LENGTH_DESCRIPTION) => (text.length > length)
  ? text.slice(0, length - 1).concat('…')
  : text;

const createFilmCardTemplate = (film) => (
  `<article class="film-card">
    <h3 class="film-card__title">${film.filmInfo.title}</h3>
    <p class="film-card__rating">${film.filmInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${getFormattedDate(film.filmInfo.release.date, 'YYYY')}</span>
      <span class="film-card__duration">${getFormattedDuration(Number(film.filmInfo.runtime))}</span>
      <span class="film-card__genre">${film.filmInfo.genre[0]}</span>
    </p>
    <img src="./${film.filmInfo.poster}" alt="${film.filmInfo.alternativeTitle}" class="film-card__poster">
    <p class="film-card__description">${trimText(film.filmInfo.description)}</p>
    <a class="film-card__comments">${film.comments.length} comments</a>
    <div class="film-card__controls">
      <button class="${addActiveModifier(film.userDetails.watchlist, 'film-card__controls-item')} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="${addActiveModifier(film.userDetails.alreadyWatched, 'film-card__controls-item')} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="${addActiveModifier(film.userDetails.favorite, 'film-card__controls-item')} film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`
);

export default class FilmView extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._openFilmDetailsClickHandler = this._openFilmDetailsClickHandler.bind(this);
    this._watchlistButtonClickHandler = this._watchlistButtonClickHandler.bind(this);
    this._watchedButtonClickHandler = this._watchedButtonClickHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setOpenFilmDetailsClickHandler(callback) {
    this._callback.openFilmDetailsClick = callback;
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._openFilmDetailsClickHandler);
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openFilmDetailsClickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openFilmDetailsClickHandler);
  }

  setWatchlistButtonClickHandler(callback) {
    this._callback.watchlistButtonClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistButtonClickHandler);
  }

  setWatchedButtonClickHandler(callback) {
    this._callback.watchedButtonClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchedButtonClickHandler);
  }

  setFavoriteButtonClickHandler(callback) {
    this._callback.favoriteButtonClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteButtonClickHandler);
  }

  _openFilmDetailsClickHandler(evt) {
    evt.preventDefault();
    this._callback.openFilmDetailsClick();
  }

  _watchlistButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistButtonClick();
  }

  _watchedButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedButtonClick();
  }

  _favoriteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteButtonClick();
  }
}

import SmartView from './smart-view';
import {getFormattedDate, getFormattedDuration} from '../utils/date-time-utils';
import {addActiveModifier} from '../utils/dom-utils';
import {trimText} from '../utils/text-formatting-utils';
import {UpdateType, UserAction} from '../types';

const createFilmCardTemplate = ({film, state}) => (
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
      <button
        class="${addActiveModifier(state.hasInWatchlist, 'film-card__controls-item')} film-card__controls-item--add-to-watchlist"
        type="button"
      >Add to watchlist</button>
      <button
        class="${addActiveModifier(state.wasAlreadyWatched, 'film-card__controls-item')} film-card__controls-item--mark-as-watched"
        type="button"
      >Mark as watched</button>
      <button
        class="${addActiveModifier(state.isFavorite, 'film-card__controls-item')} film-card__controls-item--favorite"
        type="button"
      >Mark as favorite</button>
    </div>
  </article>`
);

export default class FilmView extends SmartView {
  constructor(film, changeData) {
    super();
    this._film = film;
    this._data = FilmView.parseFilmToData(this._film);
    this._changeData = changeData;

    this._openFilmDetailsClickHandler = this._openFilmDetailsClickHandler.bind(this);
    this._watchlistButtonClickHandler = this._watchlistButtonClickHandler.bind(this);
    this._watchedButtonClickHandler = this._watchedButtonClickHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmCardTemplate(this._data);
  }

  setOpenFilmDetailsClickHandler(callback) {
    this._callback.openFilmDetailsClick = callback;
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._openFilmDetailsClickHandler);
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openFilmDetailsClickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openFilmDetailsClickHandler);
  }

  restoreHandlers() {
    this.setOpenFilmDetailsClickHandler(this._callback.openFilmDetailsClick);
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistButtonClickHandler);
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchedButtonClickHandler);
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteButtonClickHandler);
  }

  _openFilmDetailsClickHandler(evt) {
    evt.preventDefault();
    this._callback.openFilmDetailsClick();
  }

  _watchlistButtonClickHandler(evt) {
    evt.preventDefault();
    this.updateData({state: {...this._data.state, hasInWatchlist: !this._data.state.hasInWatchlist}}, true);
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, FilmView.parseDataToFilm(this._data));
  }

  _watchedButtonClickHandler(evt) {
    evt.preventDefault();
    this.updateData({state: {...this._data.state, wasAlreadyWatched: !this._data.state.wasAlreadyWatched}}, true);
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, FilmView.parseDataToFilm(this._data));
  }

  _favoriteButtonClickHandler(evt) {
    evt.preventDefault();
    this.updateData({state: {...this._data.state, isFavorite: !this._data.state.isFavorite}}, true);
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, FilmView.parseDataToFilm(this._data));
  }

  static parseFilmToData(film) {
    return Object.assign(
      {},
      {film},
      {state: {
        hasInWatchlist: film.userDetails.watchlist,
        wasAlreadyWatched: film.userDetails.alreadyWatched,
        isFavorite: film.userDetails.favorite,
      }},
    );
  }

  static parseDataToFilm(data) {
    return Object.assign(
      {},
      data.film,
      {userDetails: {
        ...data.film.userDetails,
        watchlist: data.state.hasInWatchlist,
        alreadyWatched: data.state.wasAlreadyWatched,
        favorite: data.state.isFavorite,
      }},
    );
  }
}

import {getFormattedDate, getFormattedDuration} from '../utils/date-time-utils';
import {createElement} from '../utils/dom-utils';

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
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${(film.userDetails.watchlist) && 'film-card__controls-item--active'}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${(film.userDetails.alreadyWatched) && 'film-card__controls-item--active'}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${(film.userDetails.favorite) && 'film-card__controls-item--active'}" type="button">Mark as favorite</button>
    </div>
  </article>`
);

export default class FilmView {
  constructor(film) {
    this._film = film;
    this._element = null;
    this._callback = {};
    this._openFilmDetailsClickHandler = this._openFilmDetailsClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  _openFilmDetailsClickHandler(evt) {
    evt.preventDefault();
    this._callback.openFilmDetailsClick();
  }

  setOpenFilmDetailsClickHandler(callback) {
    this._callback.openFilmDetailsClick = callback;
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._openFilmDetailsClickHandler);
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openFilmDetailsClickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openFilmDetailsClickHandler);
  }
}

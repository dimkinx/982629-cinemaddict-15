import {formattingDuration} from '../utils/utils.js';
import {formattingDate} from '../utils/dayjs-helper.js';

const MAX_LENGTH_DESCRIPTION = 140;

const cropText = (text, length = MAX_LENGTH_DESCRIPTION) => (text.length > length)
  ? text.slice(0, length - 1).concat('…')
  : text;

export const createFilmCardTemplate = (filmData) => (
  `<article class="film-card">
    <h3 class="film-card__title">${filmData.filmInfo.title}</h3>
    <p class="film-card__rating">${filmData.filmInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${formattingDate(filmData.filmInfo.release.date, 'YYYY')}</span>
      <span class="film-card__duration">${formattingDuration(Number(filmData.filmInfo.runtime))}</span>
      <span class="film-card__genre">${filmData.filmInfo.genre[0]}</span>
    </p>
    <img src="./${filmData.filmInfo.poster}" alt="${filmData.filmInfo.alternativeTitle}" class="film-card__poster">
    <p class="film-card__description">${cropText(filmData.filmInfo.description)}</p>
    <a class="film-card__comments">${filmData.comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${(filmData.userDetails.watchlist) && 'film-card__controls-item--active'}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${(filmData.userDetails.alreadyWatched) && 'film-card__controls-item--active'}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${(filmData.userDetails.favorite) && 'film-card__controls-item--active'}" type="button">Mark as favorite</button>
    </div>
  </article>`
);

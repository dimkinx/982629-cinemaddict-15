import SmartView from './smart-view';
import {BLANK_COMMENT} from '../const';
import {addActiveModifier} from '../utils/dom-utils';
import {convertDateToMs, getFormattedCommentDate, getFormattedDate, getFormattedDuration} from '../utils/date-time-utils';

const createCommentTemplate = (comment) => (
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${getFormattedCommentDate(comment.date)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
);

const createEmotionTemplate = (emotion) => (
  `<input name="emotion" type="hidden" value="${emotion}">
  <img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">`
);

const createFilmDetailsTemplate = (film, comments, {emotion, text}) => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./${film.filmInfo.poster}" alt="${film.filmInfo.alternativeTitle}">

            <p class="film-details__age">${film.filmInfo.ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${film.filmInfo.title}</h3>
                <p class="film-details__title-original">Original: ${film.filmInfo.alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${film.filmInfo.totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${film.filmInfo.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${(film.filmInfo.writers).join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${(film.filmInfo.actors).join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${getFormattedDate(film.filmInfo.release.date, 'D MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getFormattedDuration(Number(film.filmInfo.runtime))}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${film.filmInfo.release.releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${(film.filmInfo.genre.length > 1) ? 'Genres' : 'Genre'}</td>
                <td class="film-details__cell">
                    ${film.filmInfo.genre.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('\n')}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">${film.filmInfo.description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="${addActiveModifier(film.userDetails.watchlist, 'film-details__control-button')} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="${addActiveModifier(film.userDetails.alreadyWatched, 'film-details__control-button')} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
          <button type="button" class="${addActiveModifier(film.userDetails.favorite, 'film-details__control-button')} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${comments.slice().sort((first, second) => (convertDateToMs(first.date) - convertDateToMs(second.date))).map(createCommentTemplate).join('\n')}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${(emotion) ? createEmotionTemplate(emotion) : ''}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${text}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`
);

export default class FilmDetailsView extends SmartView {
  constructor(film, comments, newComment = BLANK_COMMENT) {
    super();
    this._film = film;
    this._comments = comments;
    this._data = FilmDetailsView.parseNewCommentToData(newComment);

    this._closeFilmDetailsClickHandler = this._closeFilmDetailsClickHandler.bind(this);
    this._watchlistButtonClickHandler = this._watchlistButtonClickHandler.bind(this);
    this._watchedButtonClickHandler = this._watchedButtonClickHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
    this._emotionChangeHandler = this._emotionChangeHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film, this._comments, this._data);
  }

  setCloseFilmDetailsClickHandler(callback) {
    this._callback.closeFilmDetailsClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeFilmDetailsClickHandler);
  }

  setWatchlistButtonClickHandler(callback) {
    this._callback.watchlistButtonClick = callback;
    this.getElement().querySelector('#watchlist').addEventListener('click', this._watchlistButtonClickHandler);
  }

  setWatchedButtonClickHandler(callback) {
    this._callback.watchedButtonClick = callback;
    this.getElement().querySelector('#watched').addEventListener('click', this._watchedButtonClickHandler);
  }

  setFavoriteButtonClickHandler(callback) {
    this._callback.favoriteButtonClick = callback;
    this.getElement().querySelector('#favorite').addEventListener('click', this._favoriteButtonClickHandler);
  }

  updateElement() {
    const scrollPosition = this.getElement().scrollTop;
    super.updateElement();
    this.getElement().scrollTop = scrollPosition;
  }

  restoreHandlers() {
    this.setCloseFilmDetailsClickHandler(this._callback.closeFilmDetailsClick);
    this.setWatchlistButtonClickHandler(this._callback.watchlistButtonClick);
    this.setWatchedButtonClickHandler(this._callback.watchedButtonClick);
    this.setFavoriteButtonClickHandler(this._callback.favoriteButtonClick);
    this._setInnerHandlers();
  }

  _closeFilmDetailsClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeFilmDetailsClick();
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

  _setInnerHandlers() {
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('change', this._emotionChangeHandler);
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentInputHandler);
  }

  _emotionChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emotion: evt.target.value,
    });
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      text: evt.target.value,
    }, true);
  }

  static parseNewCommentToData(newComment) {
    return Object.assign(
      {},
      newComment,
      {
        emotion: newComment.emotion,
        text: newComment.text,
      },
    );
  }
}

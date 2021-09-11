import SmartView from './smart-view';
import {addActiveModifier} from '../utils/dom-utils';
import {convertDateToMs, getFormattedCommentDate, getFormattedDate, getFormattedDuration} from '../utils/date-time-utils';
import {UpdateType, UserAction} from '../types';

const createCommentTemplate = (comment) => (
  `<li class="film-details__comment" data-comment-id="${comment.id}">
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

const createFilmDetailsTemplate = ({film, comments, state}) => (
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
          <button
            type="button"
            class="${addActiveModifier(state.hasInWatchlist, 'film-details__control-button')} film-details__control-button--watchlist"
            id="watchlist"
            name="watchlist"
          >Add to watchlist</button>
          <button
            type="button"
            class="${addActiveModifier(state.wasAlreadyWatched, 'film-details__control-button')} film-details__control-button--watched"
            id="watched"
            name="watched"
          >Already watched</button>
          <button
            type="button"
            class="${addActiveModifier(state.isFavorite, 'film-details__control-button')} film-details__control-button--favorite"
            id="favorite"
            name="favorite"
          >Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${comments.slice().sort((first, second) => (convertDateToMs(first.date) - convertDateToMs(second.date))).map(createCommentTemplate).join('\n')}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${(state.emotion) ? createEmotionTemplate(state.emotion) : ''}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${state.text}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input
                class="film-details__emoji-item visually-hidden"
                name="comment-emoji"
                type="radio"
                id="emoji-smile"
                value="smile"
                ${(state.emotion === 'smile') ? 'checked' : ''}
              >
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input
                class="film-details__emoji-item visually-hidden"
                name="comment-emoji"
                type="radio"
                id="emoji-sleeping"
                value="sleeping"
                ${(state.emotion === 'sleeping') ? 'checked' : ''}
              >
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input
                class="film-details__emoji-item visually-hidden"
                name="comment-emoji"
                type="radio"
                id="emoji-puke"
                value="puke"
                ${(state.emotion === 'puke') ? 'checked' : ''}
              >
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input
                class="film-details__emoji-item visually-hidden"
                name="comment-emoji"
                type="radio"
                id="emoji-angry"
                value="angry"
                ${(state.emotion === 'angry') ? 'checked' : ''}
              >
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
  constructor(film, comments, localComment, changeData) {
    super();
    this._film = film;
    this._comments = comments;
    this._localComment = localComment;
    this._data = FilmDetailsView.parseFilmDetailsToData(this._film, this._comments, this._localComment);
    this._changeData = changeData;

    this._closeFilmDetailsClickHandler = this._closeFilmDetailsClickHandler.bind(this);
    this._watchlistButtonClickHandler = this._watchlistButtonClickHandler.bind(this);
    this._watchedButtonClickHandler = this._watchedButtonClickHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
    this._emotionChangeHandler = this._emotionChangeHandler.bind(this);
    this._localCommentInputHandler = this._localCommentInputHandler.bind(this);
    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._data);
  }

  setCloseFilmDetailsClickHandler(callback) {
    this._callback.closeFilmDetailsClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeFilmDetailsClickHandler);
  }

  updateElement() {
    const scrollPosition = this.getElement().scrollTop;
    super.updateElement();
    this.getElement().scrollTop = scrollPosition;
  }

  restoreHandlers() {
    this.setCloseFilmDetailsClickHandler(this._callback.closeFilmDetailsClick);
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement().querySelector('#watchlist').addEventListener('click', this._watchlistButtonClickHandler);
    this.getElement().querySelector('#watched').addEventListener('click', this._watchedButtonClickHandler);
    this.getElement().querySelector('#favorite').addEventListener('click', this._favoriteButtonClickHandler);
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('change', this._emotionChangeHandler);
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._localCommentInputHandler);
    this.getElement().querySelector('.film-details__comments-list').addEventListener('click', this._commentDeleteClickHandler);
    this.getElement().querySelector('form').addEventListener('submit', this._commentSubmitHandler);
  }

  _closeFilmDetailsClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeFilmDetailsClick();
  }

  _watchlistButtonClickHandler(evt) {
    evt.preventDefault();
    this.updateData({state: {...this._data.state, hasInWatchlist: !this._data.state.hasInWatchlist}}, true);
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, FilmDetailsView.parseDataToFilm(this._data));
  }

  _watchedButtonClickHandler(evt) {
    evt.preventDefault();
    this.updateData({state: {...this._data.state, wasAlreadyWatched: !this._data.state.wasAlreadyWatched}}, true);
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, FilmDetailsView.parseDataToFilm(this._data));
  }

  _favoriteButtonClickHandler(evt) {
    evt.preventDefault();
    this.updateData({state: {...this._data.state, isFavorite: !this._data.state.isFavorite}}, true);
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, FilmDetailsView.parseDataToFilm(this._data));
  }

  _emotionChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({state: {...this._data.state, emotion: evt.target.value}});
    this._changeData(UserAction.UPDATE_LOCAL_COMMENT, UpdateType.JUST_UPDATE_DATA, FilmDetailsView.parseDataToLocalComment(this._data));
  }

  _localCommentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({state: {...this._data.state, text: evt.target.value}}, true);
    this._changeData(UserAction.UPDATE_LOCAL_COMMENT, UpdateType.JUST_UPDATE_DATA, FilmDetailsView.parseDataToLocalComment(this._data));
  }

  _commentDeleteClickHandler(evt) {
    if (!evt.target.matches('.film-details__comment-delete')) {
      return;
    }

    const commentId = evt.target.closest('li').dataset.commentId;

    evt.preventDefault();
    this.updateData({state: {...this._data.state, comments: this._data.state.comments.filter((id) => id !== +commentId)}}, true);
    this._changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, FilmDetailsView.parseDataToFilm(this._data));
    this._changeData(UserAction.DELETE_COMMENT, UpdateType.PATCH, commentId, FilmDetailsView.parseDataToFilm(this._data));
  }

  _commentSubmitHandler(evt) {
    evt.preventDefault();
  }

  static parseFilmDetailsToData(film, comments, localComment) {
    return Object.assign(
      {},
      {film},
      {comments},
      {localComment},
      {state: {
        comments: film.comments,
        hasInWatchlist: film.userDetails.watchlist,
        wasAlreadyWatched: film.userDetails.alreadyWatched,
        isFavorite: film.userDetails.favorite,
        emotion: localComment.emotion,
        text: localComment.text,
      }},
    );
  }

  static parseDataToFilm(data) {
    return Object.assign(
      {},
      data.film,
      {comments: data.state.comments},
      {userDetails: {
        ...data.film.userDetails,
        watchlist: data.state.hasInWatchlist,
        alreadyWatched: data.state.wasAlreadyWatched,
        favorite: data.state.isFavorite,
      }},
    );
  }

  static parseDataToLocalComment(data) {
    return Object.assign(
      {},
      {
        emotion: data.state.emotion,
        text: data.state.text,
      },
    );
  }
}

import FilmDetailsView from '../view/film-details-view';
import {render, replace, remove, isEscEvent} from '../utils/dom-utils';
import {UpdateType, UserAction} from '../types';

export default class FilmDetailsPresenter {
  constructor(commentsModel, closePopup, changeData) {
    this._commentsModel = commentsModel;
    this._closePopup = closePopup;
    this._changeData = changeData;

    this._filmDetailsComponent = null;

    this._handleCloseFilmDetailsClick = this._handleCloseFilmDetailsClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(film) {
    this._film = film;
    this._commentsModel.setComments(this._film.id);
    this._comments = this._commentsModel.getComments();
    this._localComment = this._commentsModel.getLocalComments();

    const previous = this._filmDetailsComponent;

    this._filmDetailsComponent = new FilmDetailsView(this._film, this._comments, this._localComment, this._changeData);
    this._filmDetailsComponent.setCloseFilmDetailsClickHandler(this._handleCloseFilmDetailsClick);

    if (previous === null) {
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this._escKeyDownHandler);

      render(document.body, this._filmDetailsComponent);
      return;
    }

    if (document.body.contains(previous.getElement())) {
      const scrollPosition = previous.getElement().scrollTop;
      replace(this._filmDetailsComponent, previous);
      this._filmDetailsComponent.getElement().scrollTop = scrollPosition;
    }

    remove(previous);
  }

  getFilmId() {
    return this._film.id;
  }

  destroy() {
    this._handleCloseFilmDetailsClick();
  }

  _handleCloseFilmDetailsClick() {
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);

    this._changeData(UserAction.RESET_LOCAL_COMMENT, UpdateType.JUST_UPDATE_DATA);
    this._closePopup();
    remove(this._filmDetailsComponent);
    this._filmDetailsComponent = null;
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._handleCloseFilmDetailsClick();
    }
  }
}

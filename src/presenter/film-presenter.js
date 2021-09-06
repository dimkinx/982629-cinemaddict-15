import FilmView from '../view/film-view';
import FilmDetailsView from '../view/film-details-view';
import {render, replace, remove, isEscEvent} from '../utils/dom-utils';
import {UpdateType, UserAction} from '../types';

export default class FilmPresenter {
  constructor(filmListContainer, changeData, changePopupState) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._changePopupState = changePopupState;

    this._filmComponent = null;
    this._filmDetailsComponent = null;
    this._isPopupOpen = false;

    this._handleOpenFilmDetailsClick = this._handleOpenFilmDetailsClick.bind(this);
    this._handleCloseFilmDetailsClick = this._handleCloseFilmDetailsClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(film, comments, localComment) {
    this._film = film;
    this._comments = comments;
    this._localComment = localComment;

    const prevFilmComponent = this._filmComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmView(this._film, this._changeData);
    this._filmComponent.setOpenFilmDetailsClickHandler(this._handleOpenFilmDetailsClick);

    if (prevFilmComponent === null) {
      render(this._filmListContainer, this._filmComponent);
      return;
    }

    if (this._filmListContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._isPopupOpen) {
      const scrollPosition = prevFilmDetailsComponent.getElement().scrollTop;
      this._filmDetailsComponent = new FilmDetailsView(this._film, this._comments, this._changeData, this._localComment);
      this._filmDetailsComponent.setCloseFilmDetailsClickHandler(this._handleCloseFilmDetailsClick);
      replace(this._filmDetailsComponent, prevFilmDetailsComponent);
      this._filmDetailsComponent.getElement().scrollTop = scrollPosition;
    }

    remove(prevFilmComponent);
    remove(prevFilmDetailsComponent);
  }

  destroy() {
    remove(this._filmComponent);
  }

  closePopup() {
    if (this._isPopupOpen) {
      this._handleCloseFilmDetailsClick();
    }
  }

  _handleOpenFilmDetailsClick() {
    if (this._isPopupOpen) {
      return;
    }

    this._changePopupState();

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._escKeyDownHandler);

    this._filmDetailsComponent = new FilmDetailsView(this._film, this._comments, this._changeData);
    this._filmDetailsComponent.setCloseFilmDetailsClickHandler(this._handleCloseFilmDetailsClick);
    render(document.body, this._filmDetailsComponent);
    this._isPopupOpen = true;
  }

  _handleCloseFilmDetailsClick() {
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);

    remove(this._filmDetailsComponent);
    this._changeData(UserAction.UPDATE_LOCAL_COMMENT, UpdateType.PATCH, {emotion: '', text: ''});
    this._isPopupOpen = false;
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._handleCloseFilmDetailsClick();
    }
  }
}

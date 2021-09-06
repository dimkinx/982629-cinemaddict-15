import SortView from '../view/sort-view';
import FilmsView from '../view/films-view';
import FilmsExtraView from '../view/films-extra-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmPresenter from './film-presenter';
import {FILMS_COUNT_PER_STEP, FILMS_EXTRA_COUNT} from '../const';
import {RenderPlace, FilterType, SortType, ExtraList, UserAction, UpdateType} from '../types';
import {render, remove} from '../utils/dom-utils';

export default class FilmsPresenter {
  constructor(mainContainer, filmsModel, commentsModel) {
    this._mainContainer = mainContainer;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filmsCountToRender = FILMS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT.name;

    this._filmPresenter = new Map();
    this._filmTopRatedPresenter = new Map();
    this._filmMostCommentedPresenter = new Map();

    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlePopupStateChange = this._handlePopupStateChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._filmsComponent = new FilmsView(this._filmsModel.getFilms().length, FilterType.ALL.title);
    this._filmListContainerElement = this._filmsComponent.getElement().querySelector('.films-list__container');

    render(this._mainContainer, this._filmsComponent);
    this._renderFilmsBoard();
    this._renderFilmsExtra();
  }

  _getFilms() {
    const films = this._filmsModel.getFilms();
    const currentSortType = SortType[this._currentSortType.toUpperCase()];
    const getProperty = (film) => currentSortType.getProperty(film);

    return (currentSortType === SortType.DEFAULT)
      ? films
      : films.slice().sort((first, second) => getProperty(second) - getProperty(first));
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmsComponent, this._sortComponent, RenderPlace.BEFORE_BEGIN);
  }

  _renderFilm(filmListContainer, film, type) {
    const filmPresenter = new FilmPresenter(filmListContainer, this._handleViewAction, this._handlePopupStateChange);
    filmPresenter.init(film, this._commentsModel.getComments()[film.id], this._commentsModel.getLocalComments());

    type = (type) ? type.split(' ').map((subType) => `${subType[0].toUpperCase()}${subType.slice(1)}`).join('') : '';

    this[`_film${type}Presenter`].set(film.id, filmPresenter);
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(this._filmListContainerElement, film));
  }

  _renderFilmsExtra() {
    Object
      .entries(ExtraList)
      .forEach(([, {title, getProperty}]) => {
        const sortedFilms = this._filmsModel.getFilms()
          .slice()
          .sort((first, second) => getProperty(second) - getProperty(first))
          .slice(0, FILMS_EXTRA_COUNT);

        if (sortedFilms.length) {
          const filmsExtraComponent = new FilmsExtraView(title);
          const filmListContainerElement = filmsExtraComponent.getElement().querySelector('.films-list__container');

          render(this._filmsComponent, filmsExtraComponent);
          sortedFilms.map((sortedFilm) => this._renderFilm(filmListContainerElement, sortedFilm, title));
        }
      });
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._filmListContainerElement, this._showMoreButtonComponent, RenderPlace.AFTER_END);
  }

  _renderFilmsBoard() {
    const films = this._getFilms();
    const filmsCount = films.length;

    if (filmsCount === 0) {
      return;
    }

    this._renderSort();
    this._renderFilms(films.slice(0, Math.min(filmsCount, this._filmsCountToRender)));

    if (filmsCount > this._filmsCountToRender) {
      this._renderShowMoreButton();
    }
  }

  _clearFilmsBoard({isFilmsCountReset = false, isSortTypeReset = false} = {}) {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();

    remove(this._sortComponent);
    remove(this._showMoreButtonComponent);

    isFilmsCountReset
      ? this._renderedTaskCount = FILMS_COUNT_PER_STEP
      : this._renderedTaskCount = Math.min(this._getFilms().length, this._renderedTaskCount);

    if (isSortTypeReset) {
      this._currentSortType = SortType.DEFAULT.name;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsBoard();
    this._renderFilmsBoard();
  }

  _handleShowMoreButtonClick() {
    const filmsCount = this._getFilms().length;
    const newFilmsCountToRender = Math.min(filmsCount, this._filmsCountToRender + FILMS_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._filmsCountToRender, newFilmsCountToRender);

    this._renderFilms(films);
    this._filmsCountToRender = newFilmsCountToRender;

    if (this._filmsCountToRender >= filmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update);
        break;
      case UserAction.UPDATE_LOCAL_COMMENT:
        this._commentsModel.updateLocalComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        [].concat(
          this._filmPresenter.get(data.id),
          this._filmTopRatedPresenter.get(data.id),
          this._filmMostCommentedPresenter.get(data.id),
        ).forEach((presenter) => presenter && presenter.init(
          data,
          this._commentsModel.getComments()[data.id],
          this._commentsModel.getLocalComments(),
        ));
        break;
      case UpdateType.MINOR:
        this._clearFilmsBoard();
        this._renderFilmsBoard();
        break;
      case UpdateType.MAJOR:
        this._clearFilmsBoard({isFilmsCountReset: true, isSortTypeReset: true});
        this._renderFilmsBoard();
        break;
    }
  }

  _handlePopupStateChange() {
    [].concat(
      ...this._filmPresenter.values(),
      ...this._filmTopRatedPresenter.values(),
      ...this._filmMostCommentedPresenter.values(),
    ).forEach((presenter) => presenter.closePopup());
  }
}

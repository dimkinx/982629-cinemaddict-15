import SortView from '../view/sort-view';
import FilmsView from '../view/films-view';
import FilmsExtraView from '../view/films-extra-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmPresenter from './film-presenter';
import FilmDetailsPresenter from './film-details-presenter';
import {render, remove} from '../utils/dom-utils';
import {applyCamelCase} from '../utils/text-formatting-utils';
import {RenderPlace, FilterType, SortType, ExtraList, UserAction, UpdateType} from '../types';
import {FILMS_COUNT_PER_STEP, FILMS_EXTRA_COUNT} from '../const';

export default class FilmsPresenter {
  constructor(mainContainer, filmsModel, commentsModel, filterModel) {
    this._mainContainer = mainContainer;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;

    this._filmsCountToRender = FILMS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT.name;

    this._filmPresenters = new Map();
    this._filmTopRatedPresenters = new Map();
    this._filmMostCommentedPresenters = new Map();
    this._filmsExtraComponents = new Map();

    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._filmDetailsPresenter = null;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmDetailsOpen = this._handleFilmDetailsOpen.bind(this);
    this._handleFilmDetailsClose = this._handleFilmDetailsClose.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._filmsComponent = new FilmsView(this._getFilms().length, FilterType[this._filterModel.getFilter().toUpperCase()].title);
    this._filmListContainerElement = this._filmsComponent.getElement().querySelector('.films-list__container');

    this._renderFilmsContainer();
    this._renderFilmsBoard();
    this._renderFilmsExtra();
  }

  _getFilms() {
    const films = this._filmsModel.getFilms();
    const currentFilterType = this._filterModel.getFilter();
    const currentSortType = SortType[this._currentSortType.toUpperCase()];
    const filteredFilms = (FilterType[currentFilterType.toUpperCase()] === FilterType.ALL)
      ? films
      : films.filter((film) => FilterType[currentFilterType.toUpperCase()].getProperty(film));

    return (currentSortType === SortType.DEFAULT)
      ? filteredFilms
      : filteredFilms.slice().sort((first, second) => currentSortType.getProperty(second) - currentSortType.getProperty(first));
  }

  _renderFilmsContainer() {
    render(this._mainContainer, this._filmsComponent);
  }

  _clearFilmsContainer() {
    remove(this._filmsComponent);
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
    const filmPresenter = new FilmPresenter(filmListContainer, this._handleFilmDetailsOpen, this._handleViewAction);
    filmPresenter.init(film);
    this[`_film${(type) ? applyCamelCase(type) : ''}Presenters`].set(film.id, filmPresenter);
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(this._filmListContainerElement, film));
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
    this._filmPresenters.forEach((presenter) => presenter.destroy());
    this._filmPresenters.clear();

    remove(this._sortComponent);
    remove(this._showMoreButtonComponent);

    if (this._getFilms().length === 1) {
      this._filmsCountToRender = FILMS_COUNT_PER_STEP;
    }

    isFilmsCountReset
      ? this._filmsCountToRender = FILMS_COUNT_PER_STEP
      : this._filmsCountToRender = Math.min(this._getFilms().length, this._filmsCountToRender);

    if (isSortTypeReset) {
      this._currentSortType = SortType.DEFAULT.name;
    }
  }

  _renderFilmsExtra() {
    Object
      .entries(ExtraList)
      .forEach(([, {title, getProperty}]) => {
        const sortedFilms = this._filmsModel.getFilms()
          .filter((film) => getProperty(film) > 0)
          .sort((first, second) => getProperty(second) - getProperty(first))
          .slice(0, FILMS_EXTRA_COUNT);

        if (sortedFilms.length) {
          const newFilmsExtraComponent = new FilmsExtraView(title);
          const filmListContainerElement = newFilmsExtraComponent.getElement().querySelector('.films-list__container');

          render(this._filmsComponent, newFilmsExtraComponent);
          sortedFilms.map((sortedFilm) => this._renderFilm(filmListContainerElement, sortedFilm, title));
          this._filmsExtraComponents.set(`film${applyCamelCase(title)}Components`, newFilmsExtraComponent);
        }
      });
  }

  _clearFilmsExtra() {
    this._filmsExtraComponents.forEach((component) => remove(component));
    this._filmsExtraComponents.clear();
    this._filmTopRatedPresenters.clear();
    this._filmMostCommentedPresenters.clear();
  }

  _updateAllFilms(updatedFilm) {
    [].concat(
      this._filmPresenters.get(updatedFilm.id),
      this._filmTopRatedPresenters.get(updatedFilm.id),
      this._filmMostCommentedPresenters.get(updatedFilm.id),
    ).forEach((presenter) => presenter && presenter.init(updatedFilm));
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

  _handleFilmDetailsOpen(film) {
    if (this._filmDetailsPresenter && this._filmDetailsPresenter.filmId === film.id) {
      return;
    }

    if (this._filmDetailsPresenter) {
      this._filmDetailsPresenter.destroy();
    }

    this._filmDetailsPresenter = new FilmDetailsPresenter(this._commentsModel, this._handleFilmDetailsClose, this._handleViewAction);
    this._filmDetailsPresenter.init(film);
  }

  _handleFilmDetailsClose() {
    this._filmDetailsPresenter = null;
  }

  _handleViewAction(actionType, updateType, update, updatedFilm) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update, updatedFilm);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update, updatedFilm);
        break;
      case UserAction.UPDATE_LOCAL_COMMENT:
        this._commentsModel.updateLocalComment(update);
        break;
      case UserAction.RESET_LOCAL_COMMENT:
        this._commentsModel.resetLocalComments();
        break;
    }
  }

  _handleModelEvent(updateType, updatedFilm) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._updateAllFilms(updatedFilm);
        this._clearFilmsExtra();
        this._renderFilmsExtra();

        if (this._filmDetailsPresenter && this._filmDetailsPresenter.filmId === updatedFilm.id) {
          this._filmDetailsPresenter.init(updatedFilm);
        }
        break;
      case UpdateType.MINOR:
        this._clearFilmsContainer();
        this._clearFilmsBoard();
        this._clearFilmsExtra();
        this.init();

        if (this._filmDetailsPresenter && this._filmDetailsPresenter.filmId === updatedFilm.id) {
          this._filmDetailsPresenter.init(updatedFilm);
        }
        break;
      case UpdateType.MAJOR:
        this._clearFilmsContainer();
        this._clearFilmsBoard({isFilmsCountReset: true, isSortTypeReset: true});
        this._clearFilmsExtra();
        this.init();

        if (this._filmDetailsPresenter && this._filmDetailsPresenter.filmId === updatedFilm.id) {
          this._filmDetailsPresenter.init(updatedFilm);
        }
        break;
    }
  }
}

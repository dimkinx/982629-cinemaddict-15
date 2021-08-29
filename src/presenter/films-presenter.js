import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import FilmsView from '../view/films-view';
import FilmsExtraView from '../view/films-extra-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmPresenter from './film-presenter';
import {FILMS_COUNT_PER_STEP, FILMS_EXTRA_COUNT} from '../const';
import {RenderPlace, FilterType, SortType, ExtraList} from '../types';
import {render, update, remove} from '../utils/dom-utils';

export default class FilmsPresenter {
  constructor(mainContainer) {
    this._mainContainer = mainContainer;
    this._filmsCountToRender = FILMS_COUNT_PER_STEP;
    this._currentFilterType = FilterType.ALL.name;
    this._currentSortType = SortType.DEFAULT.name;

    this._filmPresenter = new Map();
    this._filmTopRatedPresenter = new Map();
    this._filmMostCommentedPresenter = new Map();

    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handlePopupStateChange = this._handlePopupStateChange.bind(this);
  }

  init(films, comments) {
    this._films = films.slice();
    this._filteredFilms = films.slice();
    this._sortedFilms = films.slice();
    this._comments = comments.slice();
    this._filmsCount = this._filteredFilms.length;
    this._filmsComponent = new FilmsView(this._filmsCount, FilterType.ALL.title);
    this._filmListContainerElement = this._filmsComponent.getElement().querySelector('.films-list__container');

    this._renderFilmsBoard();
  }

  _renderFilter() {
    this._filterComponent = new FilterView(this._films);
    render(this._mainContainer, this._filterComponent, RenderPlace.AFTER_BEGIN);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
  }

  _renderSort() {
    render(this._filterComponent.getElement(), this._sortComponent, RenderPlace.AFTER_END);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderMenu() {
    this._renderFilter();

    if (this._filmsCount) {
      this._renderSort();
    }
  }

  _removeMenu() {
    remove(this._sortComponent);
    remove(this._filterComponent);
  }

  _renderFilm(filmListContainer, film, type) {
    const filmPresenter = new FilmPresenter(filmListContainer, this._handleFilmChange, this._handlePopupStateChange);
    filmPresenter.init(film, this._comments[film.id]);

    type = (type) ? type.split(' ').map((subType) => `${subType[0].toUpperCase()}${subType.slice(1)}`).join('') : '';

    this[`_film${type}Presenter`].set(film.id, filmPresenter);
  }

  _renderFilmsBatch(renderedFilmCount = 0) {
    this._sortedFilms
      .slice(renderedFilmCount, Math.min(this._filmsCount, renderedFilmCount + FILMS_COUNT_PER_STEP))
      .forEach((film) => this._renderFilm(this._filmListContainerElement, film));

    if (this._filmsCount > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderShowMoreButton() {
    render(this._filmListContainerElement, this._showMoreButtonComponent, RenderPlace.AFTER_END);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderFilmsExtra() {
    Object
      .entries(ExtraList)
      .forEach(([, {title, getProperty}]) => {
        const sortedFilms = this._films
          .filter((film) => getProperty(film) > 0)
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

  _renderFilms() {
    render(this._mainContainer, this._filmsComponent);

    if (this._filmsCount) {
      this._renderFilmsBatch();
    }
  }

  _clearFilms() {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();
    this._filmsCountToRender = FILMS_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _filterFilms(filterType) {
    this._currentFilterType = filterType;
    this._filteredFilms = (FilterType[filterType.toUpperCase()] === FilterType.ALL)
      ? this._films
      : this._films.filter((film) => FilterType[filterType.toUpperCase()].getProperty(film));
  }

  _sortFilms(sortType) {
    const getProperty = (film) => SortType[sortType.toUpperCase()].getProperty(film);
    this._currentSortType = sortType;

    this._sortedFilms = (SortType[sortType.toUpperCase()] === SortType.DEFAULT)
      ? [...this._filteredFilms]
      : [...this._filteredFilms].sort((first, second) => getProperty(second) - getProperty(first));
  }

  _renderFilmsBoard() {
    this._renderMenu();
    this._renderFilms();
    this._renderFilmsExtra();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilterType === filterType) {
      return;
    }

    this._filterFilms(filterType);
    this._sortFilms(SortType.DEFAULT.name);
    this._currentSortType = SortType.DEFAULT.name;
    this._sortComponent.setDefaultActiveClass();
    this._filmsCount = this._filteredFilms.length;

    remove(this._sortComponent);

    if (this._filmsCount) {
      this._renderSort();
    }

    this._clearFilms();
    this._renderFilmsBatch();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._filterFilms(this._currentFilterType);
    this._sortFilms(sortType);
    this._clearFilms();
    this._renderFilmsBatch();
  }

  _handleShowMoreButtonClick() {
    this._renderFilmsBatch(this._filmsCountToRender);

    this._filmsCountToRender += FILMS_COUNT_PER_STEP;

    if (this._filmsCountToRender >= this._filmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleFilmChange(updatedFilm) {
    this._films = update(this._films, updatedFilm);
    this._filteredFilms = update(this._filteredFilms, updatedFilm);
    this._sortedFilms = update(this._sortedFilms, updatedFilm);
    this._filmsCount = this._filteredFilms.length;

    this._removeMenu();
    this._renderMenu();

    [].concat(
      this._filmPresenter.get(updatedFilm.id),
      this._filmTopRatedPresenter.get(updatedFilm.id),
      this._filmMostCommentedPresenter.get(updatedFilm.id),
    ).forEach((presenter) => presenter && presenter.init(updatedFilm, this._comments[updatedFilm.id]));
  }

  _handlePopupStateChange() {
    [].concat(
      ...this._filmPresenter.values(),
      ...this._filmTopRatedPresenter.values(),
      ...this._filmMostCommentedPresenter.values(),
    ).forEach((presenter) => presenter.closePopup());
  }
}

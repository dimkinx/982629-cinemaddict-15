import FilmsView from '../view/films-view';
import FilmsExtraView from '../view/films-extra-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmPresenter from './film-presenter';
import {FILMS_COUNT_PER_STEP} from '../const';
import {RenderPlace, ExtraList, FilterList} from '../types';
import {render, update, remove} from '../utils/dom-utils';

export default class FilmsPresenter {
  constructor(mainContainer) {
    this._mainContainer = mainContainer;
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;

    this._filmPresenter = new Map();
    this._filmTopRatedPresenter = new Map();
    this._filmMostCommentedPresenter = new Map();

    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handlePopupStateChange = this._handlePopupStateChange.bind(this);
  }

  init(films, comments) {
    this._films = films.slice();
    this._comments = comments.slice();
    this._filmsComponent = new FilmsView(this._films.length, FilterList.ALL_MOVIES.title);
    this._filmListContainerElement = this._filmsComponent.getElement().querySelector('.films-list__container');

    this._renderFilms();
  }

  _renderFilm(filmListContainer, film, type) {
    type = (type) ? type.split(' ').map((subType) => `${subType[0].toUpperCase()}${subType.slice(1)}`).join('') : '';
    const filmPresenter = new FilmPresenter(filmListContainer, this._handleFilmChange, this._handlePopupStateChange);
    filmPresenter.init(film, this._comments[film.id]);
    this[`_film${type}Presenter`].set(film.id, filmPresenter);
  }

  _renderFilmsBatch(renderedFilmCount = 0) {
    this._films
      .slice(renderedFilmCount, Math.min(this._films.length, renderedFilmCount + FILMS_COUNT_PER_STEP))
      .forEach((film) => this._renderFilm(this._filmListContainerElement, film));

    if (this._films.length > FILMS_COUNT_PER_STEP) {
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
      .forEach(([, {title, getFilms}]) => {
        const sortedFilms = getFilms(this._films);

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

    if (this._films.length) {
      this._renderFilmsBatch();
      this._renderFilmsExtra();
    }
  }

  _handleShowMoreButtonClick() {
    this._renderFilmsBatch(this._renderedFilmCount);

    this._renderedFilmCount += FILMS_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleFilmChange(updatedFilm) {
    this._films = update(this._films, updatedFilm);

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

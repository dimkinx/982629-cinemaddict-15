import FilmsView from '../view/films-view';
import FilmsExtraView from '../view/films-extra-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmPresenter from './film-presenter';
import FilmDetailsPresenter from './film-details-presenter';
import {RenderPlace, render, remove, updateItem, isEscEvent} from '../utils/dom-utils';

const FILMS_COUNT_PER_STEP = 5;
const FILMS_EXTRA_COUNT = 2;

const FilterList = {
  ALL_MOVIES: {
    title: 'There are no movies in our database',
    getFilms: () => {},
  },
  WATCHLIST: {
    title: 'There are no movies to watch now',
    getFilms: () => {},
  },
  HISTORY: {
    title: 'There are no watched movies now',
    getFilms: () => {},
  },
  FAVORITES: {
    title: 'There are no favorite movies now',
    getFilms: () => {},
  },
};

const ExtraList = {
  TOP_RATED: {
    title: 'Top rated',
    getFilms: (films) => films
      .slice()
      .sort((first, second) => second.filmInfo.totalRating - first.filmInfo.totalRating)
      .slice(0, FILMS_EXTRA_COUNT),
  },
  MOST_COMMENTED: {
    title: 'Most commented',
    getFilms: (films) => films
      .filter((film) => film.comments.length > 0)
      .sort((first, second) => second.comments.length - first.comments.length)
      .slice(0, FILMS_EXTRA_COUNT),
  },
};

export default class FilmsPresenter {
  constructor(mainContainer, footerContainer) {
    this._mainContainer = mainContainer;
    this._footerContainer = footerContainer;
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;

    this._filmPresenter = new Map();
    this._filmTopRatedPresenter = new Map();
    this._filmMostCommentedPresenter = new Map();

    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCloseFilmDetails = this._handleCloseFilmDetails.bind(this);
    this._handleOpenFilmDetails = this._handleOpenFilmDetails.bind(this);
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
    const filmPresenter = new FilmPresenter(filmListContainer, this._handleFilmChange, this._handleOpenFilmDetails);
    filmPresenter.init(film);
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

    if (this._films.length !== 0) {
      this._renderFilmsBatch();
      this._renderFilmsExtra();
    }
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);

    if (this._filmPresenter.has(updatedFilm.id)) {
      this._filmPresenter.get(updatedFilm.id).init(updatedFilm, this._comments[updatedFilm.id]);
    }

    if (this._filmTopRatedPresenter.has(updatedFilm.id)) {
      this._filmTopRatedPresenter.get(updatedFilm.id).init(updatedFilm, this._comments[updatedFilm.id]);
    }

    if (this._filmMostCommentedPresenter.has(updatedFilm.id)) {
      this._filmMostCommentedPresenter.get(updatedFilm.id).init(updatedFilm, this._comments[updatedFilm.id]);
    }

    if (this._filmDetailsPresenter && this._filmDetailsPresenter.id === updatedFilm.id) {
      this._filmDetailsPresenter.init(updatedFilm, this._comments[updatedFilm.id]);
    }
  }

  _handleShowMoreButtonClick() {
    this._renderFilmsBatch(this._renderedFilmCount);

    this._renderedFilmCount += FILMS_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._handleCloseFilmDetails();
    }
  }

  _handleCloseFilmDetails() {
    this._filmDetailsPresenter.destroy();
    this._filmDetailsPresenter = null;
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleOpenFilmDetails(film) {
    if (!this._filmDetailsPresenter) {
      this._filmDetailsPresenter = new FilmDetailsPresenter(this._footerContainer, this._handleFilmChange, this._handleCloseFilmDetails);
      document.addEventListener('keydown', this._escKeyDownHandler);
    }

    this._filmDetailsPresenter.init(film, this._comments[film.id]);
  }
}

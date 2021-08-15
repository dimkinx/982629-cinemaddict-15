import FilmsView from '../view/films-view';
import FilmsEmptyView from '../view/films-empty-view';
import FilmsExtraView from '../view/films-extra-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmPresenter from './film-presenter';
import {RenderPlace, render, remove} from '../utils/dom-utils';

const FILMS_COUNT_PER_STEP = 5;
const FILMS_EXTRA_COUNT = 2;

const NavigationType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const FilmsExtraType = {
  TOP_RATED: 'TopRated',
  MOST_COMMENTED: 'MostCommented',
};

const FilmsExtraTitle = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

const navigations = [
  {
    type: NavigationType.ALL,
    title: 'There are no movies in our database',
  },
  {
    type: NavigationType.WATCHLIST,
    title: 'There are no movies to watch now',
  },
  {
    type: NavigationType.HISTORY,
    title: 'There are no watched movies now',
  },
  {
    type: NavigationType.FAVORITES,
    title: 'There are no favorite movies now',
  },
];

const filmsExtra = [
  {
    type: FilmsExtraType.TOP_RATED,
    title: FilmsExtraTitle.TOP_RATED,
    sort: (filmsData) => filmsData
      .slice()
      .sort((first, second) => second.filmInfo.totalRating - first.filmInfo.totalRating)
      .slice(0, FILMS_EXTRA_COUNT),
  },
  {
    type: FilmsExtraType.MOST_COMMENTED,
    title: FilmsExtraTitle.MOST_COMMENTED,
    sort: (filmsData) => filmsData
      .filter((filmData) => filmData.comments.length > 0)
      .sort((first, second) => second.comments.length - first.comments.length)
      .slice(0, FILMS_EXTRA_COUNT),
  },
];

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export default class FilmsPresenter {
  constructor(mainContainer, footerContainer) {
    this._mainContainer = mainContainer;
    this._footerContainer = footerContainer;
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;
    this._filmsExtra = filmsExtra;

    this._filmPresenter = new Map();
    this._filmTopRatedPresenter = new Map();
    this._filmMostCommentedPresenter = new Map();

    this._filmsComponent = new FilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._filmListContainerElement = this._filmsComponent.getElement().querySelector('.films-list__container');

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(films, comments) {
    this._films = films.slice();
    this._comments = comments;

    this._renderFilms();
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
  }

  _renderFilm(filmListContainer, film, type = '') {
    const filmPresenter = new FilmPresenter(filmListContainer, this._footerContainer, this._handleFilmChange);
    filmPresenter.init(film, this._comments[film.id]);
    this[`_film${type}Presenter`].set(film.id, filmPresenter);
  }

  _renderFilmsEmpty() {
    render(this._mainContainer, new FilmsEmptyView(navigations[0].title));
  }

  _renderFilmsBatch(renderedFilmCount = 0) {
    this._films
      .slice(renderedFilmCount, Math.min(this._films.length, renderedFilmCount + FILMS_COUNT_PER_STEP))
      .forEach((film) => this._renderFilm(this._filmListContainerElement, film));

    if (this._films.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _handleShowMoreButtonClick() {
    this._renderFilmsBatch(this._renderedFilmCount);

    this._renderedFilmCount += FILMS_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmListContainerElement, this._showMoreButtonComponent, RenderPlace.AFTER_END);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderFilmsExtra() {
    this._filmsExtra.map(({type, title, sort}) => {
      const sortedFilms = sort(this._films);

      if (sortedFilms.length) {
        const filmsExtraComponent = new FilmsExtraView(title);
        const filmListContainerElement = filmsExtraComponent.getElement().querySelector('.films-list__container');

        render(this._filmsComponent, filmsExtraComponent);
        sortedFilms.map((sortedFilm) => this._renderFilm(filmListContainerElement, sortedFilm, type));
      }
    });
  }

  _clearFilms() {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderFilms() {
    if (this._films.length === 0) {
      this._renderFilmsEmpty();
      return;
    }

    render(this._mainContainer, this._filmsComponent);
    this._renderFilmsBatch();
    this._renderFilmsExtra();
  }
}

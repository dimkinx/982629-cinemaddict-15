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
    title: FilmsExtraTitle.TOP_RATED,
    sort: (filmsData) => filmsData
      .slice()
      .sort((first, second) => second.filmInfo.totalRating - first.filmInfo.totalRating)
      .slice(0, FILMS_EXTRA_COUNT),
  },
  {
    title: FilmsExtraTitle.MOST_COMMENTED,
    sort: (filmsData) => filmsData
      .filter((filmData) => filmData.comments.length > 0)
      .sort((first, second) => second.comments.length - first.comments.length)
      .slice(0, FILMS_EXTRA_COUNT),
  },
];

export default class FilmsPresenter {
  constructor(mainContainer, footerContainer) {
    this._mainContainer = mainContainer;
    this._footerContainer = footerContainer;
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;
    this._filmsExtra = filmsExtra;

    this._filmsComponent = new FilmsView();
    this._filmListContainerElement = this._filmsComponent.getElement().querySelector('.films-list__container');

    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(films, comments) {
    this._films = films.slice();
    this._comments = comments.slice();

    this._renderFilms();
  }

  _renderFilm(filmListContainer, film) {
    const filmPresenter = new FilmPresenter(filmListContainer, this._footerContainer);
    filmPresenter.init(film, this._comments[film.id]);
  }

  _renderFilmsEmpty() {
    render(this._mainContainer, new FilmsEmptyView(navigations[0].title));
  }

  _renderFilmsBatch(renderedFilmCount = 0) {
    this._films
      .slice(renderedFilmCount, Math.min(this._films.length, renderedFilmCount + FILMS_COUNT_PER_STEP))
      .forEach((film) => this._renderFilm(this._filmListContainerElement, film));
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
    this._filmsExtra.map(({title, sort}) => {
      const sortedFilms = sort(this._films);

      if (sortedFilms.length) {
        const filmsExtraComponent = new FilmsExtraView(title);
        const filmListContainerElement = filmsExtraComponent.getElement().querySelector('.films-list__container');

        render(this._filmsComponent, filmsExtraComponent);
        sortedFilms.map((sortedFilm) => this._renderFilm(filmListContainerElement, sortedFilm));
      }
    });
  }

  _renderFilms() {
    if (this._films.length === 0) {
      this._renderFilmsEmpty();
      return;
    }

    render(this._mainContainer, this._filmsComponent);

    this._renderFilmsBatch();

    if (this._films.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }

    this._renderFilmsExtra();
  }
}

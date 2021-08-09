import ProfileView from './view/profile-view';
import MenuView from './view/menu-view';
import FilmsView from './view/films-view';
import FilmsExtraView from './view/films-extra-view';
import FilmView from './view/film-view';
import FilmsShowButtonView from './view/films-show-button-view';
import StatisticsView from './view/statistics-view';
import FilmDetailsView from './view/film-details-view';
import {generateFilm} from './mock/film';
import {generateComment} from './mock/comment';
import {RenderPlace, render} from './utils/dom-utils';

const FILMS_COUNT = 17;
const FILMS_COUNT_PER_STEP = 5;
const FILMS_EXTRA_COUNT = 2;

const rankToRangeViewsCount = {
  'novice': {
    min: 1,
    max: 10,
  },
  'fan': {
    min: 11,
    max: 20,
  },
  'movie buff': {
    min: 21,
    max: Infinity,
  },
};

const sortNameToSortFilms = {
  'Top rated': (filmsData) => filmsData
    .slice()
    .sort((first, second) => second.filmInfo.totalRating - first.filmInfo.totalRating)
    .slice(0, FILMS_EXTRA_COUNT),
  'Most commented': (filmsData) => filmsData
    .filter((filmData) => filmData.comments.length > 0)
    .sort((first, second) => second.comments.length - first.comments.length)
    .slice(0, FILMS_EXTRA_COUNT),
};

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const statisticsElement = footerElement.querySelector('.footer__statistics');

const films = new Array(FILMS_COUNT).fill(null).map((_, index) => generateFilm(index));
const comments = films.map((film) => film.comments.map((id) => generateComment(id)));
const tempFilms = [...films];

const getProfileRank = (filmsData) => {
  const viewsCount = filmsData.filter((film) => film.userDetails.alreadyWatched).length;
  let rank = '';

  Object.entries(rankToRangeViewsCount).forEach(([key, value]) => (viewsCount >= value.min && viewsCount <= value.max) && (rank = key));

  return rank;
};

render(headerElement, new ProfileView(getProfileRank(films)).getElement());
render(mainElement, new MenuView(films).getElement());
render(mainElement, new FilmsView().getElement());

const filmsSectionElement = mainElement.querySelector('.films');
const filmsListContainerElement = filmsSectionElement.querySelector('.films-list__container');

const renderFilm = (filmsListElement, filmData, filmCommentsData) => {
  const filmCardComponent = new FilmView(filmData);
  const filmDetailsComponent = new FilmDetailsView(filmData, filmCommentsData);

  const filmCardClickHandler = (evt) => {
    evt.preventDefault();
    document.body.classList.add('hide-overflow');
    document.body.appendChild(filmDetailsComponent.getElement());
  };

  filmCardComponent.getElement().querySelector('.film-card__title').addEventListener('click', filmCardClickHandler);
  filmCardComponent.getElement().querySelector('.film-card__poster').addEventListener('click', filmCardClickHandler);
  filmCardComponent.getElement().querySelector('.film-card__comments').addEventListener('click', filmCardClickHandler);

  const detailsCloseBtnClickHandler = (evt) => {
    evt.preventDefault();
    document.body.classList.remove('hide-overflow');
    document.body.removeChild(filmDetailsComponent.getElement());
  };

  filmDetailsComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', detailsCloseBtnClickHandler);

  render(filmsListElement, filmCardComponent.getElement());
};

const renderFilmsBatch = () => tempFilms
  .splice(0, FILMS_COUNT_PER_STEP)
  .map((tempFilm) => renderFilm(filmsListContainerElement, tempFilm, comments[tempFilm.id]));

renderFilmsBatch();
render(filmsListContainerElement, new FilmsShowButtonView().getElement(), RenderPlace.AFTER_END);

const showMoreButtonElement = filmsSectionElement.querySelector('.films-list__show-more');

const showMoreButtonClickHandler = () => {
  if (tempFilms.length <= FILMS_COUNT_PER_STEP) {
    showMoreButtonElement.remove();
  }

  renderFilmsBatch();
};

showMoreButtonElement.addEventListener('click', showMoreButtonClickHandler);

const generateFilmsExtra = (filmsData) => Object.entries(sortNameToSortFilms).map(
  ([sortName, sortFilms]) => ({sortName, sortedFilms: sortFilms(filmsData)}),
);

const renderFilmsExtra = ({sortName, sortedFilms}) => {
  if (sortedFilms.length !== 0) {
    const filmsExtraComponent = new FilmsExtraView(sortName);
    const containerElement = filmsExtraComponent.getElement().querySelector('.films-list__container');

    render(filmsSectionElement, filmsExtraComponent.getElement());
    sortedFilms.map((sortedFilm) => renderFilm(containerElement, sortedFilm, comments[sortedFilm.id]));
  }
};

const renderFilmsExtraSections = (filmsData) => generateFilmsExtra(filmsData)
  .map((sortNameToSortedFilms) => renderFilmsExtra(sortNameToSortedFilms));

renderFilmsExtraSections(films);

render(statisticsElement, new StatisticsView(films.length).getElement());

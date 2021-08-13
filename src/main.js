import ProfileView from './view/profile-view';
import NavigationView from './view/navigation-view';
import SortView from './view/sort-view';
import FilmsView from './view/films-view';
import FilmsEmptyView from './view/films-empty-view';
import FilmsExtraView from './view/films-extra-view';
import FilmView from './view/film-view';
import ShowMoreButtonView from './view/show-more-button-view';
import StatisticsView from './view/statistics-view';
import FilmDetailsView from './view/film-details-view';
import {generateFilm} from './mock/film';
import {generateComment} from './mock/comment';
import {RenderPlace, render, remove, isEscEvent} from './utils/dom-utils';

const FILMS_COUNT = 17;
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

const navigations = [
  {
    name: NavigationType.ALL,
    title: 'There are no movies in our database',
  },
  {
    name: NavigationType.WATCHLIST,
    title: 'There are no movies to watch now',
  },
  {
    name: NavigationType.HISTORY,
    title: 'There are no watched movies now',
  },
  {
    name: NavigationType.FAVORITES,
    title: 'There are no favorite movies now',
  },
];

const extraFilms = [
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

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const statisticsElement = footerElement.querySelector('.footer__statistics');

const filmsComponent = new FilmsView();

const films = new Array(FILMS_COUNT).fill(null).map((_, index) => generateFilm(index));
const comments = films.map((film) => film.comments.map((id) => generateComment(id)));

const getProfileRank = (filmsData) => {
  const viewsCount = filmsData.filter((film) => film.userDetails.alreadyWatched).length;
  let rank = '';

  Object.entries(rankToRangeViewsCount).forEach(([key, value]) => (viewsCount >= value.min && viewsCount <= value.max) && (rank = key));

  return rank;
};

render(mainElement, new NavigationView(films));

const renderFilm = (filmListContainer, filmData, filmCommentsData) => {
  const filmComponent = new FilmView(filmData);
  const filmDetailsComponent = new FilmDetailsView(filmData, filmCommentsData);

  const closeFilmDetailsClickHandler = () => {
    document.body.classList.remove('hide-overflow');
    remove(filmDetailsComponent);
  };

  const escKeyDownHandler = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      closeFilmDetailsClickHandler();
      document.removeEventListener('keydown', escKeyDownHandler);
    }
  };

  const openFilmDetailsClickHandler = () => {
    document.addEventListener('keydown', escKeyDownHandler);
    document.body.classList.add('hide-overflow');
    render(footerElement, filmDetailsComponent, RenderPlace.AFTER_END);
  };

  filmComponent.setOpenFilmDetailsClickHandler(openFilmDetailsClickHandler);
  filmDetailsComponent.setCloseFilmDetailsClickHandler(closeFilmDetailsClickHandler);

  render(filmListContainer, filmComponent);
};

const renderFilmsBatch = (filmListContainer, filmsData, commentsData, renderedFilmCount) => {
  let beginCount = 0;
  let endCount = FILMS_COUNT_PER_STEP;

  if (renderedFilmCount) {
    beginCount = renderedFilmCount;
    endCount = renderedFilmCount + FILMS_COUNT_PER_STEP;
  }

  return filmsData
    .slice(beginCount, Math.min(filmsData.length, endCount))
    .forEach((filmData) => renderFilm(filmListContainer, filmData, commentsData[filmData.id]));
};

const renderFilms = (mainContainer, filmsData, commentsData) => {
  if (filmsData.length === 0) {
    return render(mainContainer, new FilmsEmptyView(navigations[0].title));
  }

  render(headerElement, new ProfileView(getProfileRank(films)));
  render(mainElement, new SortView());
  render(mainContainer, filmsComponent);

  const filmListContainerElement = filmsComponent.getElement().querySelector('.films-list__container');

  renderFilmsBatch(filmListContainerElement, filmsData, commentsData);

  if (filmsData.length > FILMS_COUNT_PER_STEP) {
    let renderedFilmCount = FILMS_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();

    render(filmListContainerElement, showMoreButtonComponent, RenderPlace.AFTER_END);

    showMoreButtonComponent.setClickHandler(() => {
      renderFilmsBatch(filmListContainerElement, filmsData, commentsData, renderedFilmCount);

      renderedFilmCount += FILMS_COUNT_PER_STEP;

      if (renderedFilmCount >= filmsData.length) {
        remove(showMoreButtonComponent);
      }
    });
  }
};

renderFilms(mainElement, films, comments);

const generateFilmsExtra = (filmsData) => extraFilms.map(({title, sort}) => ({title, sortedFilms: sort(filmsData)}));

const renderFilmsExtra = ({title, sortedFilms}) => {
  if (sortedFilms.length !== 0) {
    const filmsExtraComponent = new FilmsExtraView(title);
    const containerElement = filmsExtraComponent.getElement().querySelector('.films-list__container');

    render(filmsComponent, filmsExtraComponent);
    sortedFilms.map((sortedFilm) => renderFilm(containerElement, sortedFilm, comments[sortedFilm.id]));
  }
};

const renderFilmsExtraSections = (filmsData) => generateFilmsExtra(filmsData)
  .map((extraFilmsData) => renderFilmsExtra(extraFilmsData));

renderFilmsExtraSections(films);

render(statisticsElement, new StatisticsView(films.length));

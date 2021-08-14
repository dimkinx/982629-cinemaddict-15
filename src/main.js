import ProfileView from './view/profile-view';
import NavigationView from './view/navigation-view';
import SortView from './view/sort-view';
import StatisticsView from './view/statistics-view';
import {generateFilm} from './mock/film';
import {generateComment} from './mock/comment';
import FilmsPresenter from './presenter/films-presenter';
import {render} from './utils/dom-utils';

const FILMS_COUNT = 17;

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

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const statisticsElement = footerElement.querySelector('.footer__statistics');

const films = new Array(FILMS_COUNT).fill(null).map((_, index) => generateFilm(index));
const comments = films.map((film) => film.comments.map((id) => generateComment(id)));

const filmsPresenter = new FilmsPresenter(mainElement, footerElement);

const getProfileRank = (filmsData) => {
  const viewsCount = filmsData.filter((film) => film.userDetails.alreadyWatched).length;
  let rank = '';

  Object.entries(rankToRangeViewsCount).forEach(([key, value]) => (viewsCount >= value.min && viewsCount <= value.max) && (rank = key));

  return rank;
};

if (films.length) {
  render(headerElement, new ProfileView(getProfileRank(films)));
  render(mainElement, new SortView());
}

render(mainElement, new NavigationView(films));
render(statisticsElement, new StatisticsView(films.length));

filmsPresenter.init(films, comments);

import ProfileView from './view/profile-view';
import NavigationView from './view/navigation-view';
import StatisticsView from './view/statistics-view';
import {generateFilm} from './mock/film';
import {generateComment} from './mock/comment';
import FilmsPresenter from './presenter/films-presenter';
import {FILMS_COUNT} from './const';
import {rankToRangeViewsCount} from './types';
import {render} from './utils/dom-utils';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const statisticsElement = footerElement.querySelector('.footer__statistics');

const films = new Array(FILMS_COUNT).fill(null).map((_, index) => generateFilm(index));
const comments = films.map((film) => film.comments.map((id) => generateComment(id)));

const filmsPresenter = new FilmsPresenter(mainElement);

const getProfileRank = () => {
  const viewsCount = films.filter((film) => film.userDetails.alreadyWatched).length;
  let rank = '';

  Object
    .entries(rankToRangeViewsCount)
    .forEach(([key, value]) => (viewsCount >= value.min && viewsCount <= value.max) && (rank = key));

  return rank;
};

render(mainElement, new NavigationView(films));
render(statisticsElement, new StatisticsView(films.length));

if (films.length) {
  render(headerElement, new ProfileView(getProfileRank()));
}

filmsPresenter.init(films, comments);

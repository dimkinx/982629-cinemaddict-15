import ProfileView from './view/profile-view';
import StatisticsView from './view/statistics-view';
import {generateFilm} from './mock/film';
import {generateComment} from './mock/comment';
import FilmsPresenter from './presenter/films-presenter';
import {FILMS_COUNT} from './const';
import {Rank} from './types';
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
    .entries(Rank)
    .forEach(([, {name, range}]) => {
      if (viewsCount >= range.min && viewsCount <= range.max) {
        rank = name;
      }
    });

  return rank;
};

if (films.length) {
  render(headerElement, new ProfileView(getProfileRank()));
}

filmsPresenter.init(films, comments);

render(statisticsElement, new StatisticsView(films.length));

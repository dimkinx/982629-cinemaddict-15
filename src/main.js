import {createProfileTemplate} from './view/profile.js';
import {createMenuTemplate} from './view/menu.js';
import {createFilmsSectionTemplate} from './view/films.js';
import {createFilmsListExtraTemplates} from './view/films-extra.js';
import {createFilmCardTemplate} from './view/film.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createStatisticsTemplate} from './view/statistics.js';
import {createFilmDetailsTemplate} from './view/details.js';
import {generateFilm} from './mock/film.js';
import {generateComment} from './mock/comment.js';
import {generateRating} from './mock/profile.js';

const FILMS_COUNT = 17;
const FILMS_COUNT_PER_STEP = 5;
const FILMS_EXTRA_COUNT = 2;
const ALL_FILMS_COUNT = 123456789;

const RenderPlace = {
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const statisticsSectionElement = footerElement.querySelector('.footer__statistics');

const filmsMockData = new Array(FILMS_COUNT).fill(null).map((_, index) => generateFilm(index));
const filmsCommentsMockData = filmsMockData.map((film) => film.comments.map((id) => generateComment(id)));

const render = (container, template, place = RenderPlace.BEFORE_END) => container.insertAdjacentHTML(place, template);

render(headerElement, createProfileTemplate(generateRating(filmsMockData)));
render(mainElement, createMenuTemplate(filmsMockData));
render(mainElement, createFilmsSectionTemplate());

const filmsSectionElement = mainElement.querySelector('.films');
const filmsListContainerElement = filmsSectionElement.querySelector('.films-list__container');

const renderFilmsList = (filmsData) => {
  const tempFilmsData = [...filmsData];
  const partialRenderFilms = () => tempFilmsData
    .splice(0, FILMS_COUNT_PER_STEP)
    .map((tempFilmData) => render(filmsListContainerElement, createFilmCardTemplate(tempFilmData)));

  partialRenderFilms();
  render(filmsListContainerElement, createShowMoreButtonTemplate(), RenderPlace.AFTER_END);

  const showMoreButtonElement = filmsSectionElement.querySelector('.films-list__show-more');

  const showMoreButtonClickHandler = () => {
    if (tempFilmsData.length <= FILMS_COUNT_PER_STEP) {
      showMoreButtonElement.classList.add('visually-hidden');
      showMoreButtonElement.removeEventListener('click', showMoreButtonClickHandler);
    }

    partialRenderFilms();
  };

  showMoreButtonElement.addEventListener('click', showMoreButtonClickHandler);
};

renderFilmsList(filmsMockData);

render(filmsSectionElement, createFilmsListExtraTemplates(filmsMockData, FILMS_EXTRA_COUNT));

render(statisticsSectionElement, createStatisticsTemplate(ALL_FILMS_COUNT));
render(footerElement, createFilmDetailsTemplate(filmsMockData[0], filmsCommentsMockData[0]), RenderPlace.AFTER_END);

import {createProfileTemplate} from './view/profile';
import {createMenuTemplate} from './view/menu';
import {createFilmsSectionTemplate} from './view/films';
import {createFilmsExtraTemplates} from './view/films-extra';
import {createFilmCardTemplate} from './view/film';
import {createShowMoreButtonTemplate} from './view/show-more-button';
import {createStatisticsTemplate} from './view/statistics';
import {createFilmDetailsTemplate} from './view/details';
import {generateFilm} from './mock/film';
import {generateComment} from './mock/comment';

const FILMS_COUNT = 17;
const FILMS_COUNT_PER_STEP = 5;

const RenderPlace = {
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const statisticsSectionElement = footerElement.querySelector('.footer__statistics');

const films = new Array(FILMS_COUNT).fill(null).map((_, index) => generateFilm(index));
const comments = films.map((film) => film.comments.map((id) => generateComment(id)));
const tempFilms = [...films];

const render = (container, template, place = RenderPlace.BEFORE_END) => container.insertAdjacentHTML(place, template);

render(headerElement, createProfileTemplate(films));
render(mainElement, createMenuTemplate(films));
render(mainElement, createFilmsSectionTemplate());

const filmsSectionElement = mainElement.querySelector('.films');
const filmsListContainerElement = filmsSectionElement.querySelector('.films-list__container');

const renderFilmsBatch = () => tempFilms
  .splice(0, FILMS_COUNT_PER_STEP)
  .map((tempFilm) => render(filmsListContainerElement, createFilmCardTemplate(tempFilm)));

renderFilmsBatch();
render(filmsListContainerElement, createShowMoreButtonTemplate(), RenderPlace.AFTER_END);

const showMoreButtonElement = filmsSectionElement.querySelector('.films-list__show-more');

const showMoreButtonClickHandler = () => {
  if (tempFilms.length <= FILMS_COUNT_PER_STEP) {
    showMoreButtonElement.remove();
  }

  renderFilmsBatch();
};

showMoreButtonElement.addEventListener('click', showMoreButtonClickHandler);

render(filmsSectionElement, createFilmsExtraTemplates(films));

render(statisticsSectionElement, createStatisticsTemplate(films));
render(footerElement, createFilmDetailsTemplate(films[0], comments[0]), RenderPlace.AFTER_END);

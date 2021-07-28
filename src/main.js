import {createProfileTemplate} from './view/profile.js';
import {createMenuTemplate} from './view/menu.js';
import {createFilmsSectionTemplate} from './view/films-section.js';
import {createFilmsListExtraTemplate} from './view/films-list-extra.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createStatisticsTemplate} from './view/statistics.js';
import {createFilmDetailsTemplate} from './view/film-details.js';

const FILMS_COUNT = 5;
const FILMS_EXTRA_COUNT = 2;
const FILMS_LIST_EXTRA_COUNT = 2;

const RenderPlace = {
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const statisticsSectionElement = footerElement.querySelector('.footer__statistics');

const render = (container, template, place = RenderPlace.BEFORE_END) => container.insertAdjacentHTML(place, template);

render(headerElement, createProfileTemplate());
render(mainElement, createMenuTemplate());
render(mainElement, createFilmsSectionTemplate());

const filmsSectionElement = mainElement.querySelector('.films');
const filmsListContainerElement = filmsSectionElement.querySelector('.films-list__container');

render(filmsListContainerElement, createFilmCardTemplate().repeat(FILMS_COUNT));
render(filmsListContainerElement, createShowMoreButtonTemplate(), RenderPlace.AFTER_END);
render(filmsSectionElement, createFilmsListExtraTemplate().repeat(FILMS_LIST_EXTRA_COUNT));

const filmsListExtraElements = filmsSectionElement.querySelectorAll('.films-list--extra');

filmsListExtraElements.forEach((container) => {
  const containerElement = container.querySelector('.films-list__container');
  render(containerElement, createFilmCardTemplate().repeat(FILMS_EXTRA_COUNT));
});

render(statisticsSectionElement, createStatisticsTemplate());
render(footerElement, createFilmDetailsTemplate(), RenderPlace.AFTER_END);

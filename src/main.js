import {createProfileTemplate} from './view/profile.js';
import {createMenuTemplate} from './view/menu.js';
import {createFilmsSectionTemplate} from './view/films-section.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createStatisticsTemplate} from './view/statistics.js';
import {createFilmDetailsTemplate} from './view/film-details.js';

const FILMS_NUM = 5;
const FILMS_EXTRA_NUM = 2;

const render = (container, place, template) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmsListTemplate = (containers) => {
  containers.forEach((container) => {
    if (container.parentElement.matches('.films-list--extra')) {
      render(container, 'afterbegin', createFilmCardTemplate().repeat(FILMS_EXTRA_NUM));
    } else {
      render(container, 'afterbegin', createFilmCardTemplate().repeat(FILMS_NUM));
      render(container.parentElement, 'beforeend', createShowMoreButtonTemplate());
    }
  });
};

const headerElement = document.querySelector('.header');

render(headerElement, 'beforeend', createProfileTemplate());

const mainElement = document.querySelector('.main');

render(mainElement, 'afterbegin', createMenuTemplate());
render(mainElement, 'beforeend', createFilmsSectionTemplate());

const filmsListContainerElements = mainElement.querySelectorAll('.films-list__container');

renderFilmsListTemplate(filmsListContainerElements);

const footerElement = document.querySelector('.footer');

render(footerElement, 'afterend', createFilmDetailsTemplate());

const statisticsSectionElement = footerElement.querySelector('.footer__statistics');

render(statisticsSectionElement, 'afterbegin', createStatisticsTemplate());

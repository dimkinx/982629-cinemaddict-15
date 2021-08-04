import {generateNavigation} from '../mock/menu.js';
import {capitalizeFirstLetter} from '../utils/utils.js';

const createNavigationItemTemplate = ({name, count}) => (
  `<a href="#${name}" class="main-navigation__item ${(name === 'all') && 'main-navigation__item--active'}">
    ${capitalizeFirstLetter(name)} ${(name === 'all') ? 'movies' : `<span class="main-navigation__item-count">${count}</span>`}
  </a>`
);

export const createMenuTemplate = (filmsData) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${generateNavigation(filmsData).map((filmData) => createNavigationItemTemplate(filmData)).join('\n')}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>

  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`
);

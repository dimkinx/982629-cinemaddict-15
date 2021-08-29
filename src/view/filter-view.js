import AbstractView from './abstract-view';
import {FilterType} from '../types';

const createNavigationTemplate = (films) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active" data-filter-type="${FilterType.ALL.name}">All movies</a>
      <a href="#watchlist" class="main-navigation__item" data-filter-type="${FilterType.WATCHLIST.name}">Watchlist <span class="main-navigation__item-count">${films.filter(FilterType.WATCHLIST.getProperty).length}</span></a>
      <a href="#history" class="main-navigation__item" data-filter-type="${FilterType.HISTORY.name}">History <span class="main-navigation__item-count">${films.filter(FilterType.HISTORY.getProperty).length}</span></a>
      <a href="#favorites" class="main-navigation__item" data-filter-type="${FilterType.FAVORITES.name}">Favorites <span class="main-navigation__item-count">${films.filter(FilterType.FAVORITES.getProperty).length}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class FilterView extends AbstractView {
  constructor(films) {
    super();
    this._films = films;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createNavigationTemplate(this._films);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelector('.main-navigation__items').addEventListener('click', this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
    this._setActiveClass(evt);
  }

  _setActiveClass(evt) {
    this.getElement()
      .querySelectorAll('.main-navigation__item')
      .forEach((element) => element.classList.remove('main-navigation__item--active'));

    evt.target.classList.add('main-navigation__item--active');
  }
}

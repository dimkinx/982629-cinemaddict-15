import AbstractView from './abstract-view';
import {addActiveModifier} from '../utils/dom-utils';
import {FilterType} from '../types';

const createFilterTemplate = (currentFilterType, isActive, {watchlistCount, historyCount, favoritesCount}) => (
  `<div class="main-navigation__items">
    <a
      href="#all"
      class="${addActiveModifier(isActive && currentFilterType === FilterType.ALL.name, 'main-navigation__item')}"
      data-filter-type="${FilterType.ALL.name}"
    >All movies</a>
    <a
      href="#watchlist"
      class="${addActiveModifier(isActive && currentFilterType === FilterType.WATCHLIST.name, 'main-navigation__item')}"
      data-filter-type="${FilterType.WATCHLIST.name}"
    >Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
    <a
      href="#history"
      class="${addActiveModifier(isActive && currentFilterType === FilterType.HISTORY.name, 'main-navigation__item')}"
      data-filter-type="${FilterType.HISTORY.name}"
    >History <span class="main-navigation__item-count">${historyCount}</span></a>
    <a
      href="#favorites"
      class="${addActiveModifier(isActive && currentFilterType === FilterType.FAVORITES.name, 'main-navigation__item')}"
      data-filter-type="${FilterType.FAVORITES.name}"
    >Favorites <span class="main-navigation__item-count">${favoritesCount}</span></a>
  </div>`
);

export default class FilterView extends AbstractView {
  constructor(currentFilterType, isActive, filmsCount) {
    super();
    this._currentFilterType = currentFilterType;
    this._isActive = isActive;
    this._filmsCount = filmsCount;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._currentFilterType, this._isActive, this._filmsCount);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName === 'SPAN') {
      evt.preventDefault();
    }

    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }
}

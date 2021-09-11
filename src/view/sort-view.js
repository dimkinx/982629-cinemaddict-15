import AbstractView from './abstract-view';
import {addActiveModifier} from '../utils/dom-utils';
import {SortType} from '../types';

const createSortTemplate = (currentSortType) => (
  `<ul class="sort">
    <li>
      <a
        href="#"
        class="${addActiveModifier(currentSortType === SortType.DEFAULT.name, 'sort__button')}"
        data-sort-type="${SortType.DEFAULT.name}"
      >Sort by default</a>
    </li>
    <li>
      <a
        href="#"
        class="${addActiveModifier(currentSortType === SortType.DATE.name, 'sort__button')}"
        data-sort-type="${SortType.DATE.name}"
      >Sort by date</a>
    </li>
    <li>
      <a
        href="#"
        class="${addActiveModifier(currentSortType === SortType.RATING.name, 'sort__button')}"
        data-sort-type="${SortType.RATING.name}"
      >Sort by rating</a>
    </li>
  </ul>`
);

export default class SortView extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}

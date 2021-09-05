import AbstractView from './abstract-view';
import {SortType} from '../types';
import {addActiveModifier} from '../utils/dom-utils';

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

  setDefaultActiveClass() {
    this.getElement()
      .querySelectorAll('.sort__button')
      .forEach((element, index) => {
        element.classList.remove('sort__button--active');

        if (!index) {
          element.classList.add('sort__button--active');
        }
      });
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}

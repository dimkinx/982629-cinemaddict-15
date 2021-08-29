import AbstractView from './abstract-view';
import {SortType} from '../types';

const createSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT.name}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE.name}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING.name}">Sort by rating</a></li>
  </ul>`
);

export default class SortView extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
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
    this._setActiveClass(evt);
  }

  _setActiveClass(evt) {
    this.getElement()
      .querySelectorAll('.sort__button')
      .forEach((element) => element.classList.remove('sort__button--active'));

    evt.target.classList.add('sort__button--active');
  }
}

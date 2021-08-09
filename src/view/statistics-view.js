import {createElement} from '../utils/dom-utils';

const REGEXP_ALL_FILMS_COUNT = /\B(?=(\d{3})+(?!\d))/g;

const createStatisticsTemplate = (filmsCount) => `<p>${filmsCount.toString().replace(REGEXP_ALL_FILMS_COUNT, ' ')} movies inside</p>`;

export default class StatisticsView {
  constructor(filmsCount) {
    this._filmsCount = filmsCount;
    this._element = null;
  }

  getTemplate() {
    return createStatisticsTemplate(this._filmsCount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

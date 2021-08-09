import {createElement} from '../utils/dom-utils';

const REGEXP_ALL_FILMS_COUNT = /\B(?=(\d{3})+(?!\d))/g;

const createStatisticsTemplate = (count) => `<p>${count.toString().replace(REGEXP_ALL_FILMS_COUNT, ' ')} movies inside</p>`;

export default class StatisticsView {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createStatisticsTemplate(this._films);
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

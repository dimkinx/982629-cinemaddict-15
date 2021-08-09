import {createElement} from '../utils/dom-utils';

const createFilmsShowButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class FilmsShowButtonView {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsShowButtonTemplate();
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

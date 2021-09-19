import {createElement} from '../utils/dom-utils';
import {SHAKE_ANIMATION_DURATION, SHAKE_ANIMATION_TIMEOUT} from '../const';

export default class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error('AbstractView method not implemented: getTemplate');
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

  shake(element) {
    element.style.animation = `shake ${SHAKE_ANIMATION_DURATION}s`;
    setTimeout(() => element.style.animation = '', SHAKE_ANIMATION_TIMEOUT);
  }
}

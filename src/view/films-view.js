import {createElement} from '../utils/dom-utils';

const createFilmsTemplate = (filmsCount) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title${(filmsCount) ? ' visually-hidden' : ''}">${(filmsCount) ? 'All movies. Upcoming' : 'There are no movies in our database'}</h2>

      ${(filmsCount) ? '<div class="films-list__container"></div>' : ''}
    </section>
  </section>`
);

export default class FilmsView {
  constructor(filmsCount) {
    this._filmsCount = filmsCount;
    this._element = null;
  }

  getTemplate() {
    return createFilmsTemplate(this._filmsCount);
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

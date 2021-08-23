import AbstractView from './abstract-view';

const createFilmsTemplate = (filmsCount, title) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title ${(filmsCount) ? 'visually-hidden' : ''}">${(filmsCount) ? 'All movies. Upcoming' : `${title}`}</h2>

      ${(filmsCount) ? '<div class="films-list__container"></div>' : ''}
    </section>
  </section>`
);

export default class FilmsView extends AbstractView {
  constructor(filmsCount, title) {
    super();
    this._filmsCount = filmsCount;
    this._title = title;
  }

  getTemplate() {
    return createFilmsTemplate(this._filmsCount, this._title);
  }
}

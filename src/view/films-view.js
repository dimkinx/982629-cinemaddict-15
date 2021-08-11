import AbstractView from './abstract-view';

const createFilmsTemplate = (filmsCount) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title${(filmsCount) ? ' visually-hidden' : ''}">${(filmsCount) ? 'All movies. Upcoming' : 'There are no movies in our database'}</h2>

      ${(filmsCount) ? '<div class="films-list__container"></div>' : ''}
    </section>
  </section>`
);

export default class FilmsView extends AbstractView {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createFilmsTemplate(this._filmsCount);
  }
}

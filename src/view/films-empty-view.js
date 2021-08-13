import AbstractView from './abstract-view';

const createFilmsEmptyTemplate = (title) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${title}</h2>

    </section>
  </section>`
);

export default class FilmsEmptyView extends AbstractView {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return createFilmsEmptyTemplate(this._title);
  }
}

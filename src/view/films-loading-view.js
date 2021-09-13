import AbstractView from './abstract-view';
import {LOADING_TITLE} from '../const';

const createFilmsLoadingTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${LOADING_TITLE}</h2>
    </section>
  </section>`
);

export default class FilmsLoadingView extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createFilmsLoadingTemplate();
  }
}

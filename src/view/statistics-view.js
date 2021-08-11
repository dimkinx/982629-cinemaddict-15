import AbstractView from './abstract-view';

const REGEXP_ALL_FILMS_COUNT = /\B(?=(\d{3})+(?!\d))/g;

const createStatisticsTemplate = (filmsCount) => `<p>${filmsCount.toString().replace(REGEXP_ALL_FILMS_COUNT, ' ')} movies inside</p>`;

export default class StatisticsView extends AbstractView {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createStatisticsTemplate(this._filmsCount);
  }
}

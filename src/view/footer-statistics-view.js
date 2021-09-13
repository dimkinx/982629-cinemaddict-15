import AbstractView from './abstract-view';
import {REGEXP_ALL_FILMS_COUNT} from '../const';

const createFooterStatisticsTemplate = (filmsCount) => `<p>${filmsCount.toString().replace(REGEXP_ALL_FILMS_COUNT, ' ')} movies inside</p>`;

export default class FooterStatisticsView extends AbstractView {
  constructor(filmsCount = 0) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._filmsCount);
  }
}

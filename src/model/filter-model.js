import AbstractObserver from '../utils/abstract-observer.js';
import {FilterType} from '../types';

export default class FilterModel extends AbstractObserver {
  constructor() {
    super();
    this._filter = FilterType.ALL.name;
  }

  setFilter(updateType, filter) {
    this._filter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._filter;
  }
}

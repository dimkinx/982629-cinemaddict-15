import AbstractObserver from '../utils/abstract-observer.js';
import {FilterType} from '../types';

export default class FilterModel extends AbstractObserver {
  constructor() {
    super();
    this._filter = FilterType.ALL.name;
    this._isActive = true;
  }

  setFilter(updateType, filter) {
    this._filter = filter;
    this._notify(updateType, filter);
  }

  setState(updateType, isActive) {
    this._isActive = isActive;
    this._notify(updateType, isActive);
  }

  getFilter() {
    return this._filter;
  }

  getState() {
    return this._isActive;
  }
}

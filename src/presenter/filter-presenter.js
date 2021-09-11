import NavigationView from '../view/navigation-view';
import FilterView from '../view/filter-view';
import {render, replace, remove} from '../utils/dom-utils';
import {FilterType, RenderPlace, UpdateType} from '../types';

export default class FilterPresenter {
  constructor(mainContainer, filterModel, filmsModel) {
    this._mainContainer = mainContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._filterComponent = null;
    this._currentFilterType = FilterType.ALL.name;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const previous = this._filterComponent;

    this._navigationComponent = new NavigationView();
    this._filterComponent = new FilterView(this._currentFilterType, this._getCounts());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (previous === null) {
      render(this._mainContainer, this._navigationComponent, RenderPlace.AFTER_BEGIN);
      render(this._navigationComponent, this._filterComponent, RenderPlace.AFTER_BEGIN);
      return;
    }

    replace(this._filterComponent, previous);
    remove(previous);
  }

  _getCounts() {
    const films = this._filmsModel.getFilms();

    return {
      watchlistCount: films.filter(FilterType.WATCHLIST.getProperty).length,
      historyCount: films.filter(FilterType.HISTORY.getProperty).length,
      favoritesCount: films.filter(FilterType.FAVORITES.getProperty).length,
    };
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilterType === filterType) {
      return;
    }

    this._currentFilterType = filterType;
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleModelEvent(updateType) {
    if (updateType === UpdateType.PATCH) {
      return;
    }

    this.init();
  }
}

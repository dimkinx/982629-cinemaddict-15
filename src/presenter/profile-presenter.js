import ProfileView from '../view/profile-view';
import {render, replace, remove} from '../utils/dom-utils';
import {Rank, UpdateType} from '../types';

export default class ProfilePresenter {
  constructor(headerContainer, profileModel, filmsModel) {
    this._headerContainer = headerContainer;
    this._profileModel = profileModel;
    this._filmsModel = filmsModel;

    this._profileComponent = null;

    this._handleProfileModelEvent = this._handleProfileModelEvent.bind(this);
    this._handleFilmsModelEvent = this._handleFilmsModelEvent.bind(this);

    this._profileModel.addObserver(this._handleProfileModelEvent);
    this._filmsModel.addObserver(this._handleFilmsModelEvent);
  }

  init() {
    const previous = this._profileComponent;

    if (previous && !this._getViewsCount()) {
      remove(this._profileComponent);
      this._profileComponent = null;
      return;
    }

    if (previous === null) {
      this._profileComponent = new ProfileView(this._getProfileRank());
      render(this._headerContainer, this._profileComponent);
      return;
    }

    if (this._headerContainer.contains(previous.getElement())) {
      this._profileComponent = new ProfileView(this._profileModel.getRank());
      replace(this._profileComponent, previous);
    }

    remove(previous);
  }

  _getViewsCount() {
    return this._filmsModel.getFilms().filter((film) => film.userDetails.alreadyWatched).length;
  }

  _getProfileRank() {
    const viewsCount = this._getViewsCount();
    let rank = '';

    Object
      .entries(Rank)
      .forEach(([, {name, range}]) => {
        if (viewsCount >= range.min && viewsCount <= range.max) {
          rank = name;
        }
      });

    return rank;
  }

  _handleProfileModelEvent() {
    this.init();
  }

  _handleFilmsModelEvent(updateType) {
    if (updateType !== UpdateType.PATCH) {
      const rank = this._getProfileRank();

      if (rank !== this._profileModel.getRank()) {
        this._profileModel.setRank(UpdateType.MAJOR, rank);
      }
    }
  }
}

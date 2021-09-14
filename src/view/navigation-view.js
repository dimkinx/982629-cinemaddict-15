import AbstractView from './abstract-view';

const createNavigationTemplate = () => (
  `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class NavigationView extends AbstractView {
  constructor() {
    super();

    this._isTarget = false;
    this._navigationClickHandler = this._navigationClickHandler.bind(this);
  }

  getTemplate() {
    return createNavigationTemplate(this._isTarget);
  }

  setNavigationClickHandler(callback) {
    this._callback.navigationClick = callback;
    this.getElement().addEventListener('click', this._navigationClickHandler);
  }

  _navigationClickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._isTarget = evt.target.matches('.main-navigation__additional');
    this._toggleActiveClass(this._isTarget);
    this._callback.navigationClick(this._isTarget);
  }

  _toggleActiveClass(isTarget) {
    const statsLinkElement = this.getElement().querySelector('.main-navigation__additional');

    isTarget
      ? statsLinkElement.classList.add('main-navigation__additional--active')
      : statsLinkElement.classList.remove('main-navigation__additional--active');
  }
}

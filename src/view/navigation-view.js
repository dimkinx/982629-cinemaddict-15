import AbstractView from './abstract-view';

const createNavigationTemplate = () => (
  `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class NavigationView extends AbstractView {
  getTemplate() {
    return createNavigationTemplate();
  }
}

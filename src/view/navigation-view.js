import AbstractView from './abstract-view';
import {addActiveModifier} from '../utils/dom-utils';

const createNavigationTemplate = (isTarget) => (
  `<nav class="main-navigation">
    <a href="#stats" class="${addActiveModifier(isTarget, 'main-navigation__additional')}">Stats</a>
  </nav>`
);

export default class NavigationView extends AbstractView {
  getTemplate() {
    return createNavigationTemplate();
  }
}

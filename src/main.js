import Api from './api/api.js';
import ProfileModel from './model/profile-model';
import FilterModel from './model/filter-model';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import ProfilePresenter from './presenter/profile-presenter';
import FilterPresenter from './presenter/filter-presenter';
import FilmsPresenter from './presenter/films-presenter';
import NavigationView from './view/navigation-view';
import StatisticView from './view/statistic-view';
import FooterStatisticView from './view/footer-statistic-view';
import {remove, render} from './utils/dom-utils';
import {RenderPlace, UpdateType} from './types';
import {END_POINT, AUTHORIZATION} from './const';

const headerContainer = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footerContainer = document.querySelector('.footer');
const footerStatisticContainer = footerContainer.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);
const profileModel = new ProfileModel();
const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const navigationComponent = new NavigationView();
const footerStatisticComponent = new FooterStatisticView();

const profilePresenter = new ProfilePresenter(headerContainer, profileModel, filmsModel);
const filterPresenter = new FilterPresenter(navigationComponent, filterModel, filmsModel);
const filmsPresenter = new FilmsPresenter(mainContainer, filmsModel, commentsModel, filterModel, api);

let isPrevTarget = false;
let statisticComponent = null;

const handleNavigationClick = (isStatsTarget) => {
  if (isPrevTarget === isStatsTarget) {
    return;
  }

  isPrevTarget = isStatsTarget;

  if (isStatsTarget) {
    filmsPresenter.destroy();
    filterModel.setState(UpdateType.MAJOR, !isStatsTarget);
    statisticComponent = new StatisticView(profileModel.getRank(), filmsModel.getFilms());
    render(mainContainer, statisticComponent, RenderPlace.BEFORE_END);
    return;
  }

  remove(statisticComponent);
  filmsPresenter.destroy();
  filterModel.setState(UpdateType.MAJOR, !isStatsTarget);
  filmsPresenter.init();
};

profilePresenter.init();
render(mainContainer, navigationComponent, RenderPlace.AFTER_BEGIN);
navigationComponent.setNavigationClickHandler(handleNavigationClick);
filterPresenter.init();
filmsPresenter.init();
render(footerStatisticContainer, footerStatisticComponent);

api.getFilms()
  .then((films) => filmsModel.setFilms(UpdateType.INIT, films))
  .then(() => {
    remove(footerStatisticComponent);
    render(footerStatisticContainer, new FooterStatisticView(filmsModel.getFilms().length));
  })
  .catch(() => filmsModel.setFilms(UpdateType.INIT, []));

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

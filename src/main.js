import Api from './api.js';
import ProfileModel from './model/profile-model';
import FilterModel from './model/filter-model';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import ProfilePresenter from './presenter/profile-presenter';
import FilterPresenter from './presenter/filter-presenter';
import FilmsPresenter from './presenter/films-presenter';
import NavigationView from './view/navigation-view';
import FooterStatisticsView from './view/footer-statistics-view';
import {remove, render} from './utils/dom-utils';
import {RenderPlace, UpdateType} from './types';
import {END_POINT, AUTHORIZATION} from './const';

const headerContainer = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footerContainer = document.querySelector('.footer');
const footerStatisticsContainer = footerContainer.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);
const profileModel = new ProfileModel();
const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const navigationComponent = new NavigationView();
// const statisticsComponent = new StatisticsView();
const footerStatisticsComponent = new FooterStatisticsView();
const profilePresenter = new ProfilePresenter(headerContainer, profileModel, filmsModel);

const filterPresenter = new FilterPresenter(navigationComponent, filterModel, filmsModel);
const filmsPresenter = new FilmsPresenter(mainContainer, filmsModel, commentsModel, filterModel, api);

let isPrevTarget = false;

const handleNavigationClick = (isStatsTarget) => {
  if (isPrevTarget === isStatsTarget) {
    return;
  }

  isPrevTarget = isStatsTarget;

  if (isStatsTarget) {
    filmsPresenter.destroy();
    filterModel.setState(UpdateType.MAJOR, !isStatsTarget);
    // render(mainContainer, statisticsComponent, RenderPlace.AFTER_BEGIN);
    return;
  }

  // remove(statisticsComponent);
  filmsPresenter.destroy();
  filterModel.setState(UpdateType.MAJOR, !isStatsTarget);
  filmsPresenter.init();
};

profilePresenter.init();
render(mainContainer, navigationComponent, RenderPlace.AFTER_BEGIN);
navigationComponent.setNavigationClickHandler(handleNavigationClick);
filterPresenter.init();
filmsPresenter.init();
render(footerStatisticsContainer, footerStatisticsComponent);

api.getFilms()
  .then((films) => filmsModel.setFilms(UpdateType.INIT, films))
  .then(() => {
    remove(footerStatisticsComponent);
    render(footerStatisticsContainer, new FooterStatisticsView(filmsModel.getFilms().length));
  })
  .catch(() => filmsModel.setFilms(UpdateType.INIT, []));

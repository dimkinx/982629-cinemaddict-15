import Api from './api.js';
import ProfileModel from './model/profile-model';
import FilterModel from './model/filter-model';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import ProfilePresenter from './presenter/profile-presenter';
import FilterPresenter from './presenter/filter-presenter';
import FilmsPresenter from './presenter/films-presenter';
import FooterStatisticsView from './view/footer-statistics-view';
import {remove, render} from './utils/dom-utils';
import {END_POINT, AUTHORIZATION} from './const';
import {UpdateType} from './types';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const statisticsElement = footerElement.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);
const profileModel = new ProfileModel();
const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const footerStatisticsComponent = new FooterStatisticsView();

const profilePresenter = new ProfilePresenter(headerElement, profileModel, filmsModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel);
const filmsPresenter = new FilmsPresenter(mainElement, filmsModel, commentsModel, filterModel, api);

profilePresenter.init();
filterPresenter.init();
filmsPresenter.init();
render(statisticsElement, footerStatisticsComponent);

api.getFilms()
  .then((films) => filmsModel.setFilms(UpdateType.INIT, films))
  .then(() => {
    remove(footerStatisticsComponent);
    render(statisticsElement, new FooterStatisticsView(filmsModel.getFilms().length));
  })
  .catch(() => filmsModel.setFilms(UpdateType.INIT, []));

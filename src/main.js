import {generateFilm} from './mock/film';
import {generateComment} from './mock/comment';
import ProfileModel from './model/profile-model';
import FilterModel from './model/filter-model';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import ProfilePresenter from './presenter/profile-presenter';
import FilterPresenter from './presenter/filter-presenter';
import FilmsPresenter from './presenter/films-presenter';
import StatisticsView from './view/statistics-view';
import {FILMS_COUNT} from './const';
import {render} from './utils/dom-utils';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const statisticsElement = footerElement.querySelector('.footer__statistics');

const films = new Array(FILMS_COUNT).fill(null).map((_, index) => generateFilm(index));
const allComments = films.map((film) => film.comments.map((id) => generateComment(id)));

// const profileModel = new ProfileModel();
const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

// const profilePresenter = new ProfilePresenter(headerElement, profileModel, filmsModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel);
const filmsPresenter = new FilmsPresenter(mainElement, filmsModel, commentsModel, filterModel);

filmsModel.setFilms(films);
commentsModel.setAllComments(allComments);

// profilePresenter.init();
filterPresenter.init();
filmsPresenter.init();
render(statisticsElement, new StatisticsView(films.length));

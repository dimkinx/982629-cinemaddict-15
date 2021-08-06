import {createFilmCardTemplate} from './film';

const FILMS_EXTRA_COUNT = 2;

const sortNameToSortFilms = {
  'Top rated': (films) => films
    .slice()
    .sort((first, second) => second.filmInfo.totalRating - first.filmInfo.totalRating),
  'Most commented': (films) => films
    .filter((filmData) => filmData.comments.length > 0)
    .sort((firstFilm, secondFilm) => secondFilm.comments.length - firstFilm.comments.length),
};

const generateFilmsExtra = (films) => Object.entries(sortNameToSortFilms).map(
  ([sortName, sortFilms]) => ({
    sortName,
    sortedFilms: sortFilms(films),
  }),
);

const createFilmsExtraTemplate = ({sortName, sortedFilms}) => {
  if (sortedFilms.length === 0) {
    return '';
  }

  return (
    `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${sortName}</h2>

      <div class="films-list__container">
        ${sortedFilms.slice(0, FILMS_EXTRA_COUNT).map((film) => createFilmCardTemplate(film)).join('\n')}
      </div>
    </section>`
  );
};

export const createFilmsExtraTemplates = (films) => generateFilmsExtra(films)
  .map((sortNameToSortedFilms) => createFilmsExtraTemplate(sortNameToSortedFilms))
  .join('\n');

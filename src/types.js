import {sortFilmsByDate} from './utils/date-time-utils';

export const RenderPlace = {
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

export const Rank = {
  NOVICE: {
    name: 'novice',
    range: {
      min: 1,
      max: 10,
    },
  },
  FAN: {
    name: 'fan',
    range: {
      min: 11,
      max: 20,
    },
  },
  MOVIE_BUFF: {
    name: 'movie buff',
    range: {
      min: 21,
      max: Infinity,
    },
  },
};

export const FilterList = {
  ALL_MOVIES: {
    title: 'There are no movies in our database',
    getFilms: () => {},
  },
  WATCHLIST: {
    title: 'There are no movies to watch now',
    getFilms: () => {},
  },
  HISTORY: {
    title: 'There are no watched movies now',
    getFilms: () => {},
  },
  FAVORITES: {
    title: 'There are no favorite movies now',
    getFilms: () => {},
  },
};

export const SortType = {
  DEFAULT: {
    name: 'default',
    getFilms: (films) => [...films],
  },
  DATE: {
    name: 'date',
    getFilms: (films) => [...films].sort(sortFilmsByDate),
  },
  RATING: {
    name: 'rating',
    getFilms: (films) => [...films].sort((first, second) => second.filmInfo.totalRating - first.filmInfo.totalRating),
  },
};

export const ExtraList = {
  TOP_RATED: {
    title: 'Top rated',
    getProperty: (film) => film.filmInfo.totalRating,
  },
  MOST_COMMENTED: {
    title: 'Most commented',
    getProperty: (film) => film.comments.length,
  },
};

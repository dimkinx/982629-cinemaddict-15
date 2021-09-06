import {convertDateToMs} from './utils/date-time-utils';

export const RenderPlace = {
  BEFORE_BEGIN: 'beforebegin',
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_LOCAL_COMMENT: 'UPDATE_LOCAL_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
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

export const FilterType = {
  ALL: {
    name: 'all',
    title: 'There are no movies in our database',
  },
  WATCHLIST: {
    name: 'watchlist',
    title: 'There are no movies to watch now',
    getProperty: (film) => film.userDetails.watchlist,
  },
  HISTORY: {
    name: 'history',
    title: 'There are no watched movies now',
    getProperty: (film) => film.userDetails.alreadyWatched,
  },
  FAVORITES: {
    name: 'favorites',
    title: 'There are no favorite movies now',
    getProperty: (film) => film.userDetails.favorite,
  },
};

export const SortType = {
  DEFAULT: {
    name: 'default',
  },
  DATE: {
    name: 'date',
    getProperty: (film) => convertDateToMs(film.filmInfo.release.date),
  },
  RATING: {
    name: 'rating',
    getProperty: (film) => film.filmInfo.totalRating,
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

import {convertDateToMs} from './utils/date-time-utils';

export const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export const EndPoint = {
  MOVIES: 'movies',
  COMMENTS: 'comments',
  SYNC: 'sync',
};

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
  RESET_LOCAL_COMMENT: 'RESET_LOCAL_COMMENT',
};

export const UpdateType = {
  JUST_UPDATE_DATA: 'JUST_UPDATE_DATA',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const CommentsFormState = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export const ProviderErrorMessage = {
  GET_COMMENTS: 'Get comments failed',
  ADD_COMMENT: 'Add comment failed',
  DELETE_COMMENT: 'Delete comment failed',
  SYNC: 'Sync data failed',
};

export const StatisticFilterType = {
  ALL_TIME: {
    name: 'all-time',
    shorthand: 'all',
  },
  TODAY: {
    name: 'today',
    shorthand: 'd',
  },
  WEEK: {
    name: 'week',
    shorthand: 'w',
  },
  MONTH: {
    name: 'month',
    shorthand: 'M',
  },
  YEAR: {
    name: 'year',
    shorthand: 'y',
  },
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

import {FILMS_EXTRA_COUNT} from './const';

export const RenderPlace = {
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

const ProfileRank = {
  NOVICE: 'novice',
  FAN: 'fan',
  MOVIE_BUFF: 'movie buff',
};

export const rankToRangeViewsCount = {
  [ProfileRank.NOVICE]: {
    min: 1,
    max: 10,
  },
  [ProfileRank.FAN]: {
    min: 11,
    max: 20,
  },
  [ProfileRank.MOVIE_BUFF]: {
    min: 21,
    max: Infinity,
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

export const SortList = {
  DEFAULT: {
    type: 'default',
    getFilms: () => {},
  },
  DATE: {
    type: 'date',
    getFilms: () => {},
  },
  RATING: {
    type: 'rating',
    getFilms: () => {},
  },
};

export const ExtraList = {
  TOP_RATED: {
    title: 'Top rated',
    getFilms: (films) => films
      .slice()
      .sort((first, second) => second.filmInfo.totalRating - first.filmInfo.totalRating)
      .slice(0, FILMS_EXTRA_COUNT),
  },
  MOST_COMMENTED: {
    title: 'Most commented',
    getFilms: (films) => films
      .filter((film) => film.comments.length > 0)
      .sort((first, second) => second.comments.length - first.comments.length)
      .slice(0, FILMS_EXTRA_COUNT),
  },
};

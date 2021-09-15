import {isDateInPeriod} from './date-time-utils';
import {StatisticFilterType} from '../types';

export const getWatchedFilms = (films) => films.filter((film) => film.userDetails.alreadyWatched);

export const getFilmsByPeriod = (films, period) => (period !== StatisticFilterType.ALL_TIME.shorthand)
  ? films.filter((film) => isDateInPeriod(film.userDetails.watchingDate, period))
  : films;

export const getTotalDuration = (films) => {
  const duration = films.reduce((acc, film) => (acc + film.filmInfo.runtime), 0);
  const hours = Math.trunc(duration / 60);
  const minutes = duration % 60;

  return {h: hours, m: minutes};
};

const getGenres = (films) => [...new Set(films.reduce((acc, film) => ([...acc, ...film.filmInfo.genre]), []))];

const getCountFilmsByGenre = (films, currentGenre) => films
  .reduce((count, film) => count + (film.filmInfo.genre.some((filmGenre) => filmGenre === currentGenre)), 0);

const sortGenresByCount = (firstGenre, secondGenre) => secondGenre.count - firstGenre.count;

export const getChartOptions = (films) => {
  const genresByCount = getGenres(films)
    .map((genre) => ({genre, count: getCountFilmsByGenre(films, genre)}))
    .sort(sortGenresByCount);
  const genres = genresByCount.map((item) => item.genre);

  return {
    topGenre: genres[0],
    genres: genres,
    counts: genresByCount.map((item) => item.count),
  };
};

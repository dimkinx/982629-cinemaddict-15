const REGEXP_ALL_FILMS_COUNT = /\B(?=(\d{3})+(?!\d))/g;

export const createStatisticsTemplate = (films) => `<p>${films.length.toString().replace(REGEXP_ALL_FILMS_COUNT, ' ')} movies inside</p>`;

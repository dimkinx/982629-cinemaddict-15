const filmsToSort = {
  'Top rated': (filmsData) => [...filmsData]
    .sort((firstFilm, secondFilm) => secondFilm.filmInfo.totalRating - firstFilm.filmInfo.totalRating),
  'Most commented': (filmsData) => filmsData
    .filter((filmData) => filmData.comments.length > 0)
    .sort((firstFilm, secondFilm) => secondFilm.comments.length - firstFilm.comments.length),
};

export const generateFilmsExtra = (filmsData) => Object.entries(filmsToSort).map(
  ([sortName, sortData]) => ({
    name: sortName,
    data: sortData(filmsData),
  }),
);

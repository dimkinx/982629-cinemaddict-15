const filmsToFilter = {
  all: () => {},
  watchlist: (filmsData) => filmsData.filter((film) => film.userDetails.watchlist).length,
  history: (filmsData) => filmsData.filter((film) => film.userDetails.alreadyWatched).length,
  favorites: (filmsData) => filmsData.filter((film) => film.userDetails.favorite).length,
};

export const generateNavigation = (filmsData) => Object.entries(filmsToFilter).map(
  ([filterName, getFilmsCount]) => ({
    name: filterName,
    count: getFilmsCount(filmsData),
  }),
);

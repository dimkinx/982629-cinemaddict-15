const ratingToRangeViewsCount = {
  'novice': {
    min: 1,
    max: 10,
  },
  'fan': {
    min: 11,
    max: 20,
  },
  'movie buff': {
    min: 21,
    max: Infinity,
  },
};

const ratingToRangeViewsCountMap = new Map(Object.entries(ratingToRangeViewsCount));

export const generateRating = (filmsData) => {
  const viewsCount = filmsData.filter((filmData) => filmData.userDetails.alreadyWatched).length;
  let rating = '';

  ratingToRangeViewsCountMap.forEach((value, key) => (viewsCount >= value.min && viewsCount <= value.max) && (rating = key));

  return rating;
};

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

export const createProfileTemplate = (films) => {
  const viewsCount = films.filter((film) => film.userDetails.alreadyWatched).length;
  let rank = '';

  Object.entries(ratingToRangeViewsCount).forEach(([key, value]) => (viewsCount >= value.min && viewsCount <= value.max) && (rank = key));

  return (
    `<section class="header__profile profile">
      ${(rank) && `<p class="profile__rating">${rank}</p>`}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

import AbstractView from './abstract-view';

const createProfileTemplate = (rank) => (
  `<section class="header__profile profile">
    ${(rank) && `<p class="profile__rating">${rank}</p>`}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class ProfileView extends AbstractView {
  constructor(rank) {
    super();
    this._rank = rank;
  }

  getTemplate() {
    return createProfileTemplate(this._rank);
  }
}

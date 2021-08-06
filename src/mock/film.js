import {getRandomNumber, shuffleItems, getRandomItem} from '../utils/utils';
import dayjs from 'dayjs';

const TITLES = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'The Great Flamarion',
  'Made for Each Other',
];

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-great-flamarion.jpg',
  'the-dance-of-life.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const AGE_RATINGS = [0, 6, 12, 16, 18];

const DIRECTORS = [
  'Robert Zemeckis',
  'Alfred Hitchcock',
  'Michael Curtiz',
  'Frank Darabont',
  'Jonathan Demme',
  'Peter Jackson',
  'Joel Coen',
  'Ethan Coen',
  'Quentin Tarantino',
  'M. Night Shyamalan',
];

const WRITERS = [
  'Stephen King',
  'J.R.R. Tolkien',
  'Edgar Allan Poe',
  'George Orwell',
  'Ursula K. Le Guin',
  'Ted Chiang',
  'Anton Chekhov',
  'Federico García Lorca',
  'Franz Kafka',
  'Lord Byron',
];

const ACTORS = [
  'Robert De Niro',
  'Al Pacino',
  'Dustin Hoffman',
  'Tom Hanks',
  'Anthony Hopkins',
  'Charlize Theron',
  'Cate Blanchett',
  'Julianne Moore',
  'Kate Winslet',
  'Susan Sarandon',
];

const RELEASE_COUNTRIES = [
  'Australia',
  'Russia',
  'France',
  'Germany',
  'Italy',
  'Netherlands',
  'Norway',
  'Sweden',
  'United Kingdom',
  'United States',
];

const GENRES = [
  'Comedy',
  'Drama',
  'Mystery',
  'Musical',
  'Western',
  'Cartoon',
  'Film-Noir',
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

let idComment = 0;

export const generateDate = (year, day) => dayjs()
  .subtract(getRandomNumber(0, year), 'year')
  .subtract(getRandomNumber(0, day), 'day')
  .subtract(getRandomNumber(0, 23), 'hour')
  .subtract(getRandomNumber(0, 59), 'minute')
  .subtract(getRandomNumber(0, 59), 'second')
  .toISOString();

export const generateFilm = (id) => ({
  id: String(id),
  comments: new Array(getRandomNumber(0, 5)).fill(null).map(() => idComment++),
  filmInfo: {
    title: getRandomItem(TITLES),
    alternativeTitle: getRandomItem(TITLES),
    totalRating: getRandomNumber(1, 10, 1),
    poster: `images/posters/${getRandomItem(POSTERS)}`,
    ageRating: getRandomItem(AGE_RATINGS),
    director: getRandomItem(DIRECTORS),
    writers: shuffleItems(WRITERS).slice(0, getRandomNumber(1, 2)),
    actors: shuffleItems(ACTORS).slice(0, getRandomNumber(3, 5)),
    release: {
      date: generateDate(70, 30),
      releaseCountry: getRandomItem(RELEASE_COUNTRIES),
    },
    runtime: getRandomNumber(20, 250),
    genre: shuffleItems(GENRES).slice(0, getRandomNumber(1, 3)),
    description: shuffleItems(DESCRIPTIONS).slice(0, getRandomNumber(1, 5)).join(' '),
  },
  userDetails: {
    watchlist: Boolean(getRandomNumber(0, 1)),
    alreadyWatched: Boolean(getRandomNumber(0, 1)),
    watchingDate: generateDate(0, 30),
    favorite: Boolean(getRandomNumber(0, 1)),
  },
});

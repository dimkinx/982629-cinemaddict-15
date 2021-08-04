export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloat = (a = 1, b = 10, digits = 1) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);

  return Number((lower + Math.random() * (upper - lower)).toFixed(digits));
};

export const shuffleItems = (items) => [...items].map((_, index, shuffledItems) => {
  const randomIndex = index + (Math.floor(Math.random() * (shuffledItems.length - index)));
  [shuffledItems[index], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[index]];

  return shuffledItems[index];
});

export const getRandomItem = (items) => items[getRandomInteger(0, items.length - 1)];

export const formattingDuration = (duration) => {
  const hours = Math.trunc(duration / 60);
  const minutes = duration % 60;

  return `${(hours) ? String(hours).concat('h ') : ''}${minutes}m`;
};

export const capitalizeFirstLetter = (text) => text[0].toUpperCase() + text.slice(1);

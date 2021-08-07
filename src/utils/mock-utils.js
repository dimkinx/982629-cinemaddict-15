export const getRandomNumber = (a = 0, b = 1, digits = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);

  if (digits) {
    return Number((lower + Math.random() * (upper - lower)).toFixed(digits));
  }

  return Math.floor(Math.ceil(lower) + Math.random() * (Math.floor(upper) - Math.ceil(lower) + 1));
};

export const shuffleItems = (items) => items.slice().sort(() => Math.random() - 0.5);

export const getRandomItem = (items) => items[getRandomNumber(0, items.length - 1)];

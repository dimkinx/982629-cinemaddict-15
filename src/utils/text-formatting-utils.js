import {MAX_LENGTH_DESCRIPTION} from '../const';

export const trimText = (text, length = MAX_LENGTH_DESCRIPTION) => (text.length > length)
  ? text.slice(0, length - 1).concat('…')
  : text;

export const applyCamelCase = (text) => text
  .split(' ')
  .map((subText) => `${subText[0].toUpperCase()}${subText.slice(1)}`)
  .join('');

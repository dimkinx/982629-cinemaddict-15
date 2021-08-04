import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import {getRandomInteger} from './utils.js';

dayjs.extend(relativeTime);
dayjs.extend(isBetween);

export const formattingDate = (date, template) => dayjs(date).format(template);

export const formattingCommentDate = (date) => dayjs(date).isBetween(dayjs().subtract(3, 'day'), dayjs())
  ? dayjs().to(dayjs(date))
  : dayjs(date).format('YYYY/MM/D HH:mm');

export const generateDate = (year, day) => dayjs()
  .subtract(getRandomInteger(0, year), 'year')
  .subtract(getRandomInteger(0, day), 'day')
  .subtract(getRandomInteger(0, 23), 'hour')
  .subtract(getRandomInteger(0, 59), 'minute')
  .subtract(getRandomInteger(0, 59), 'second')
  .toISOString();

export const sortDataByDate = (data) => data.sort((firstDate, secondDate) => (
  dayjs(firstDate.date).valueOf() - dayjs(secondDate.date).valueOf()),
);

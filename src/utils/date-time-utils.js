import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const convertDateToMs = (date) => dayjs(date).valueOf();

export const getFormattedDate = (date, template) => dayjs(date).format(template);

export const getFormattedCommentDate = (date) => dayjs(date).fromNow();

export const getFormattedDuration = (time) => dayjs
  .duration(time, 'minutes')
  .format(`${(Math.trunc(time / 60)) ? 'H[h] ' : ''}mm[m]`);

export const getCurrentISOStringDate = () => dayjs().toDate().toISOString();

export const isDateInPeriod = (date, period) => dayjs(date).isAfter(dayjs().subtract(1, period));

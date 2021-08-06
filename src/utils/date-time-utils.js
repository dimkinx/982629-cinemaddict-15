import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(relativeTime);
dayjs.extend(isBetween);

export const getFormattedDate = (date, template) => dayjs(date).format(template);

export const getFormattedCommentDate = (date) => dayjs(date).isBetween(dayjs().subtract(3, 'day'), dayjs())
  ? dayjs().to(dayjs(date))
  : dayjs(date).format('YYYY/MM/D HH:mm');

export const sortByDate = (data) => data.sort((first, second) => dayjs(first.date).valueOf() - dayjs(second.date).valueOf());

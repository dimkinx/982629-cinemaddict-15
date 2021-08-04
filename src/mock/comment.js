import {getRandomItem} from '../utils/utils.js';
import {generateDate} from '../utils/dayjs-helper.js';

const AUTHORS = [
  'Malcolm "Mal" Reynolds',
  'Zoe Alleyne Washburne',
  'Hoban "Wash" Washburne',
  'Inara Serra',
  'Jayne Cobb',
  'Kaywinnet Lee "Kaylee" Frye',
  'Simon Tam',
  'River Tam',
  'Derrial Book',
];

const COMMENTS = [
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',
  'Great movie!',
  'Best Writing on TV to date',
  'Extremely clever but also laugh-out-loud funny',
  'World Class comedy!',
  'Watch this show: it ROCKS',
  'I\'m rooting for this show!',
];

const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

export const generateComment = (id) => ({
  id: String(id),
  author: getRandomItem(AUTHORS),
  comment: getRandomItem(COMMENTS),
  date: generateDate(0, 5),
  emotion: getRandomItem(EMOTIONS),
});

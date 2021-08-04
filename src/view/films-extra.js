import {generateFilmsExtra} from '../mock/films-extra.js';
import {createFilmCardTemplate} from './film.js';

const createFilmsListExtraTemplate = ({name, data}, filmsCount) => (
  (data.length === 0)
    ? ''
    : `<section class="films-list films-list--extra">
        <h2 class="films-list__title">${name}</h2>

        <div class="films-list__container">
          ${data.slice(0, filmsCount).map((filmData) => createFilmCardTemplate(filmData)).join('\n')}
        </div>
      </section>`
);

export const createFilmsListExtraTemplates = (filmsData, filmsCount) => generateFilmsExtra(filmsData)
  .map((filmData) => createFilmsListExtraTemplate(filmData, filmsCount))
  .join('\n');

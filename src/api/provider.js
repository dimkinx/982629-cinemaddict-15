import FilmsModel from '../model/films-model';
import {isOnline} from '../utils/dom-utils';
import {ProviderErrorMessage} from '../types';

const createStoreStructure = (items) => items
  .reduce((acc, current) => Object.assign({}, acc, {
    [current.id]: current,
  }), {});

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms(){
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(items);
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());
    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((update) => {
          this._store.setItem(update.id, FilmsModel.adaptToServer(update));
          return update;
        });
    }

    this._store.setItem(film.id, FilmsModel.adaptToServer({...film}));
    return Promise.resolve(film);
  }

  getComments(filmId){
    if (isOnline()) {
      return this._api.getComments(filmId);
    }

    return Promise.reject(new Error(ProviderErrorMessage.GET_COMMENTS));
  }

  addComment(comment, filmId) {
    if (isOnline()) {
      return this._api.addComment(comment, filmId);
    }

    return Promise.reject(new Error(ProviderErrorMessage.ADD_COMMENT));
  }

  deleteComment(commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId);
    }

    return Promise.reject(new Error(ProviderErrorMessage.DELETE_COMMENT));
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());
      return this._api.sync(storeFilms)
        .then((response) => {
          const updatedFilms = createStoreStructure(response.updated);
          this._store.setItems(updatedFilms);
        });
    }

    return Promise.reject(new Error(ProviderErrorMessage.SYNC));
  }
}

import AbstractObserver from '../utils/abstract-observer.js';
import {LOCAL_COMMENT_DEFAULT} from '../const';

export default class CommentsModel extends AbstractObserver {
  constructor() {
    super();
    this._allComments = [];
    this._comments = [];
    this._localComment = LOCAL_COMMENT_DEFAULT;
  }

  setAllComments(allComments) {
    this._allComments = allComments.slice();
  }

  setComments(filmId) {
    this._comments = this._allComments[filmId].slice();
  }

  getComments() {
    return this._comments;
  }

  getLocalComments() {
    return this._localComment;
  }

  addComment(updateType, update) {
    this._comments = [
      update,
      ...this._comments,
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, commentId, updatedFilm) {
    const index = this._comments.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    this._allComments[updatedFilm.id] = this._comments;

    this._notify(updateType, updatedFilm);
  }

  updateLocalComment(updatedLocalComment = LOCAL_COMMENT_DEFAULT) {
    this._localComment = updatedLocalComment;
  }
}

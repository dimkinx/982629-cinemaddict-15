import AbstractObserver from '../utils/abstract-observer.js';
import {LOCAL_COMMENT_DEFAULT} from '../const';

export default class CommentsModel extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
    this._localComment = LOCAL_COMMENT_DEFAULT;
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  getLocalComment() {
    return this._localComment;
  }

  updateLocalComment(updatedLocalComment) {
    this._localComment = updatedLocalComment;
  }

  resetLocalComments() {
    this._localComment = LOCAL_COMMENT_DEFAULT;
  }

  addComment(updateType, comment) {
    this._comments = [
      comment,
      ...this._comments,
    ];

    this._notify(updateType, comment);
  }

  deleteComment(updateType, commentId) {
    const index = this._comments.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    this._notify(updateType, commentId);
  }
}

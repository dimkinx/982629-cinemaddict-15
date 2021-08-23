import AbstractView from '../view/abstract-view';
import {RenderPlace} from '../types';

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export const render = (container, child, place = RenderPlace.BEFORE_END) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (child instanceof AbstractView) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPlace.BEFORE_END:
      container.append(child);
      break;
    case RenderPlace.AFTER_END:
      container.after(child);
  }
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

export const update = (items, updateItem) => {
  const index = items.findIndex((item) => item.id === updateItem.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    updateItem,
    ...items.slice(index + 1),
  ];
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const addActiveModifier = (predicate, className) => predicate ? `${className} ${className}--active`: className;

import AbstractView from '../view/abstract-view';
import {RenderPlace} from '../types';

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export const render = (container, element, place = RenderPlace.BEFORE_END) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (element instanceof AbstractView) {
    element = element.getElement();
  }

  switch (place) {
    case (RenderPlace.BEFORE_BEGIN):
      container.before(element);
      break;
    case (RenderPlace.AFTER_BEGIN):
      container.prepend(element);
      break;
    case (RenderPlace.BEFORE_END):
      container.append(element);
      break;
    case (RenderPlace.AFTER_END):
      container.after(element);
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

export const isCtrlEnterEvent = (evt) => evt.ctrlKey && evt.key === 'Enter';

export const addActiveModifier = (predicate, className) => predicate ? `${className} ${className}--active`: className;

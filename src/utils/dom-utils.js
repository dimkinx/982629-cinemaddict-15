import AbstractView from '../view/abstract-view';

export const RenderPlace = {
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
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

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export const remove = (component) => {
  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

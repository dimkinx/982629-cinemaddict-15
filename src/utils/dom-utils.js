export const RenderPlace = {
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

export const render = (container, element, place = RenderPlace.BEFORE_END) => {
  switch (place) {
    case RenderPlace.BEFORE_END:
      container.append(element);
      break;
    case RenderPlace.AFTER_END:
      container.after(element);
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

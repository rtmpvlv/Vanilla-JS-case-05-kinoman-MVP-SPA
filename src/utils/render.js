/* eslint-disable import/no-cycle */
import Abstract from '../view/abstract';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place = RenderPosition.BEFOREEND) => {
  let containerElement = container;
  let injectedElement = element;

  if (containerElement instanceof Abstract) {
    containerElement = containerElement.getElement();
  }

  if (injectedElement instanceof Abstract) {
    injectedElement = injectedElement.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      containerElement.prepend(injectedElement);
      break;
    case RenderPosition.BEFOREEND:
      containerElement.append(injectedElement);
      break;
    default: break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

export const replace = (elementOne, elementTwo) => {
  let firstChild = elementOne;
  let secondChild = elementTwo;

  if (secondChild instanceof Abstract) {
    secondChild = secondChild.getElement();
  }

  if (firstChild instanceof Abstract) {
    firstChild = firstChild.getElement();
  }

  const parent = secondChild.parentElement;

  if (parent === null || secondChild === null || firstChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(firstChild, secondChild);
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

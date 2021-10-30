import { getRandomInteger } from '../mock-data/utils-and-const';

const createFilmsQuantityTemplate = () => (
  `
    <p>${getRandomInteger(10000, 1000000)} movies inside</p>
  `
);

export default createFilmsQuantityTemplate;

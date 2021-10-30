import {
  Emotions,
  Titles,
  Directors,
  Writers,
  Actors,
  Countries,
  Genres,
  PostersURL,
  CommentsAuthors,
  Comments,
  Descriptions,
  getRandomInteger,
  getRandomArrayElement,
  generateDate,
  getArray
} from './utils-and-const';

const generateReleaseInfo = () => ({
  date: generateDate(10000, 0),
  country: getRandomArrayElement(Countries),
});

const generateDescriptions = () => {
  const arr = [];
  for (let i = 0; i < getRandomInteger(1, Descriptions.length); i += 1) {
    arr.push(Descriptions[i]);
  }
  return arr.join(' ');
};

const generateCommentsList = () => {
  const arr = [];
  const getComments = () => ({
    id: getRandomInteger(1, 100000),
    author: getRandomArrayElement(CommentsAuthors),
    comment: getRandomArrayElement(Comments),
    date: generateDate(60, 0),
    emotion: getRandomArrayElement(Emotions),
  });
  for (let i = 0; i < getRandomInteger(1, 5); i += 1) {
    arr.push(getComments());
  }
  return arr;
};

const generateFilmInfo = () => ({
  title: getRandomArrayElement(Titles),
  alternativeTitle: getRandomArrayElement(Titles),
  totalRating: getRandomInteger(1, 10),
  poster: getRandomArrayElement(PostersURL),
  ageRating: getRandomInteger(0, 18),
  director: getRandomArrayElement(Directors),
  writers: getArray(Writers),
  actors: getArray(Actors),
  release: generateReleaseInfo(),
  runtime: getRandomInteger(60, 180),
  genre: getArray(Genres),
  description: generateDescriptions(),
});

const generateUserDetails = () => {
  const alreadyWatched = Boolean(getRandomInteger(0, 1));
  let watchList = false;
  let watchingDate = false;
  let favorite = false;
  if (alreadyWatched) {
    watchList = Boolean(getRandomInteger(0, 1));
    watchingDate = generateDate(60, 0);
    favorite = Boolean(getRandomInteger(0, 1));
  }
  return {
    watchList,
    alreadyWatched,
    watchingDate,
    favorite,
  };
};

const getMovieData = () => ({
  id: getRandomInteger(1, 1000),
  comments: generateCommentsList(),
  filmInfo: generateFilmInfo(),
  userDetails: generateUserDetails(),
});

export default getMovieData;

import dayjs from 'dayjs';

const Emotions = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const Titles = [
  'Die hard',
  'Die hard 2',
  'Terminator',
  'Terminator 2',
  'Rambo: First blood',
  'Titanic',
  'Avatar',
  'Harry Potter pt. 1',
  'Lord of The Rings',
  'Green Mile',
  'Showshank Redemtion',
  'Lord of the Rings: The Return of the King',
  'Lord of the Rings: The Two Towers',
  'Forrest Gump',
  'Lion King',
  'Interstellar',
  'Coco',
  'Pulp Fiction',
  'Lock, Stock and Two Smoking Barrels',
  'WALL·E',
  'Intouchables',
];

const Directors = [
  'David Lynch',
  'Stanley Kubrick',
  'Robert Bresson',
  'Alfred Hitchcock',
  'Martin Scorsese',
  'Clint Eastwood',
  'William Wyler',
  'Billy Wilder',
  'John Ford',
  'Fritz Lang',
  'Fred Zinnemann',
  'Sidney Lumet',
  'Francis Ford Coppola',
  'David Fincher',
  'Vittorio De Sica',
];

const Writers = [
  'Quentin Tarantino',
  'Billy Wilder',
  'Ethan Coen',
  'Aaron Sorkin',
  'Stanley Kubrick',
  'Francis Ford Coppola',
  'Christopher Nolan',
  'John Hughes',
  'Ernest Lehman',
  'Ingmar Bergman',
  'Paul Schrader',
  'Orson Welles',
  'Paul Thomas Anderson',
  'Woody Allen',
  'Nora Ephron',
];

const Actors = [
  'Robert De Niro',
  'Jack Nicholson',
  'Marlon Brando',
  'Denzel Washington',
  'Katharine Hepburn',
  'Humphrey Bogart',
  'Meryl Streep',
  'Daniel Day-Lewis',
  'Sidney Poitier',
  'Clark Gable',
  'Ingrid Bergman',
  'Tom Hanks',
  'Elizabeth Taylor',
  'Bette Davis',
  'Gregory Peck',
  'Leonardo DiCaprio',
];

const Countries = [
  'Russia',
  'Georgia',
  'USA',
  'UK',
  'Ukraine',
  'Spain',
  'Italy',
  'Germany',
  'France',
  'Japan',
  'China',
  'Moldova',
  'Portugal',
];

const Genres = [
  'Action',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Thriller',
];

const PostersURL = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
];

const CommentsAuthors = [
  'Hannah Garcia',
  'Emily Davis',
  'Jessica Jones',
  'Megan Rodriguez',
  'Charlotte Smith',
  'Lucy Williams',
  'Chloe Wilson',
  'Sophie Johnson',
  'Lauren Miller',
  'Katie Brown',
  'Efa William',
  'Conall Navarro',
];

const Comments = [
  'That\'s a great movie!',
  'Cool',
  'Nice one!',
  'Boored',
  'Waste of time',
  'That\'s ok.',
  'This movie is totally ruined my life',
  'I like this movie very much.',
  'I\'d never see this crap again.',
];

const Descriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const generateDate = (daysBefore, daysAFter) => {
  const daysGap = getRandomInteger(-daysBefore, daysAFter);
  const hourGap = getRandomInteger(0, 23);
  const minuteGap = getRandomInteger(0, 60);
  return dayjs()
    .add(daysGap, 'day')
    .add(hourGap, 'hour')
    .add(minuteGap, 'minute')
    .toDate();
};

const getArray = (values) => {
  const arr = [];
  for (let i = 0; i < getRandomInteger(1, 3); i += 1) {
    arr.push(getRandomArrayElement(values));
  }
  return arr;
};

const convertDuration = (runtime) => {
  const mins = runtime % 60;
  const hours = (runtime / 60).toFixed(0);
  return `${hours}h ${mins}m`;
};

export const updateItem = (items, updatedItem) => {
  const index = items.findIndex((item) => item.id === updatedItem.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    updatedItem,
    ...items.slice(index + 1),
  ];
};

export {
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
  getArray,
  convertDuration
};

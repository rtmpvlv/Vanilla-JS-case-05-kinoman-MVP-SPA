/* eslint-disable max-len */
import dayjs from 'dayjs';

export const sortByDate = (film1, film2) => dayjs(film2.filmInfo.release.date).diff(dayjs(film1.filmInfo.release.date));
export const sortByRating = (film1, film2) => film2.filmInfo.totalRating - film1.filmInfo.totalRating;

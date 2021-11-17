import dayjs from 'dayjs';

export const humanizeDate = (date) => {
  const timeDifference = dayjs().diff(date, 'm');
  if (timeDifference < 5) {
    return 'now';
  }
  if (timeDifference < 59) {
    return `${timeDifference} minute(s) ago`;
  }
  if (timeDifference < 1439) {
    return `${(timeDifference / 60).toFixed()} hour(s) ago`;
  }
  if (timeDifference < 43199) {
    return `${(timeDifference / 1440).toFixed()} day(s) ago`;
  }
  if (timeDifference < 15767999) {
    return `${(timeDifference / 43200).toFixed()} month(s) ago`;
  }
  return `${dayjs(date).format('YYYY/MM/DD HH:mm')}`;
};

export const convertDuration = (runtime) => {
  const mins = runtime % 60;
  const hours = (runtime / 60).toFixed(0);
  return `${hours}h ${mins}m`;
};

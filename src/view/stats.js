/* eslint-disable no-underscore-dangle */
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import SmartView from './smart';
import { calcWatchedMovies } from '../utils/sort';
import { StatisticsSortType } from '../utils/const';

const BAR_HEIGHT = 50;

const renderChart = (chart, movies) => (new Chart(chart, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: calcWatchedMovies(movies).types,
    datasets: [{
      data: calcWatchedMovies(movies).sortedMovies,
      backgroundColor: '#ffe800',
      hoverBackgroundColor: '#ffe800',
      anchor: 'start',
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 20,
        },
        color: '#ffffff',
        anchor: 'start',
        align: 'start',
        offset: 40,
      },
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#ffffff',
          padding: 100,
          fontSize: 20,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        barThickness: 24,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
}));

const createStatsTemplate = (rank, movies, sortType) => {
  const filmInfo = calcWatchedMovies(movies);
  return `
    <section class="statistic">

      <p class="statistic__rank">
        ${rank ? `Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${rank}</span>` : ''}
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${StatisticsSortType.ALLTIME}" value="${StatisticsSortType.ALLTIME}" ${sortType === StatisticsSortType.ALLTIME ? 'checked' : ''}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${StatisticsSortType.TODAY}" value="${StatisticsSortType.TODAY}" ${sortType === StatisticsSortType.TODAY ? 'checked' : ''}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${StatisticsSortType.WEEK}" value="${StatisticsSortType.WEEK}" ${sortType === StatisticsSortType.WEEK ? 'checked' : ''}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${StatisticsSortType.MONTH}" value="${StatisticsSortType.MONTH}" ${sortType === StatisticsSortType.MONTH ? 'checked' : ''}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${StatisticsSortType.YEAR}" value="${StatisticsSortType.YEAR}" ${sortType === StatisticsSortType.YEAR ? 'checked' : ''}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${filmInfo.watched} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${filmInfo.runtimeHours}<span class="statistic__item-description">h</span>${filmInfo.runtimeMins}<span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${filmInfo.types[0] ? filmInfo.types[0] : ''}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`;
};

export default class Stats extends SmartView {
  constructor(movies) {
    super();
    this._data = movies.slice();
    this._dataWithCorrectedTimePeriod = this._data;
    this._chart = null;

    this._statisticSortType = StatisticsSortType.ALLTIME;

    this._statiticsChangeHandler = this._statiticsChangeHandler.bind(this);

    this._setStatisticsFilterHandler();
    this._setChart();
  }

  getTemplate() {
    return createStatsTemplate(
      this._getRank(),
      this._dataWithCorrectedTimePeriod,
      this._statisticSortType,
    );
  }

  removeElement() {
    super.removeElement();

    if (this._chart !== null) {
      this._chart = null;
    }
  }

  restoreHandlers() {
    this._setStatisticsFilterHandler();
  }

  _getRank() {
    const watchedMoviesLength = this._data
      .filter((movie) => movie.userDetails.alreadyWatched).length;
    if (watchedMoviesLength >= 1 && watchedMoviesLength <= 10) {
      return 'Novice';
    }
    if (watchedMoviesLength >= 11 && watchedMoviesLength <= 20) {
      return 'Fan';
    }
    if (watchedMoviesLength >= 21) {
      return 'Movie buff';
    }
    return '';
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }
    const chart = this.getElement().querySelector('.statistic__chart');
    chart.height = BAR_HEIGHT * 5;
    this._chart = renderChart(chart, this._dataWithCorrectedTimePeriod);
  }

  _setStatisticsFilterHandler() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._statiticsChangeHandler);
  }

  _statiticsChangeHandler(evt) {
    switch (evt.target.value) {
      case StatisticsSortType.ALLTIME:
        this._dataWithCorrectedTimePeriod = this._data;
        this._statisticSortType = StatisticsSortType.ALLTIME;
        this.updateElement();
        if (this._dataWithCorrectedTimePeriod.length > 0) {
          this._setChart();
        }
        break;
      case StatisticsSortType.TODAY:
        this._dataWithCorrectedTimePeriod = this._data
          .filter((item) => dayjs().subtract(24, 'h').isBefore(item.userDetails.watchingDate));
        this._statisticSortType = StatisticsSortType.TODAY;
        this.updateElement();
        if (this._dataWithCorrectedTimePeriod.length > 0) {
          this._setChart();
        }
        break;
      case StatisticsSortType.WEEK:
        this._dataWithCorrectedTimePeriod = this._data
          .filter((item) => dayjs().subtract(7, 'd').isBefore(item.userDetails.watchingDate));
        this._statisticSortType = StatisticsSortType.WEEK;
        this.updateElement();
        if (this._dataWithCorrectedTimePeriod.length > 0) {
          this._setChart();
        }
        break;
      case StatisticsSortType.MONTH:
        this._dataWithCorrectedTimePeriod = this._data
          .filter((item) => dayjs().subtract(30, 'd').isBefore(item.userDetails.watchingDate));
        this._statisticSortType = StatisticsSortType.MONTH;
        this.updateElement();
        this._setChart();
        break;
      case StatisticsSortType.YEAR:
        this._dataWithCorrectedTimePeriod = this._data
          .filter((item) => dayjs().subtract(365, 'd').isBefore(item.userDetails.watchingDate));
        this._statisticSortType = StatisticsSortType.YEAR;
        this.updateElement();
        if (this._dataWithCorrectedTimePeriod.length > 0) {
          this._setChart();
        }
        break;
      default:
        throw new Error('Unexpected statistics sort type value.');
    }
  }
}

import SmartView from './smart-view';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getFilmsByPeriod, getTotalDuration, getWatchedFilms, getChartOptions} from '../utils/statistic-utils';
import {applyUpperSnakeCase} from '../utils/text-formatting-utils';
import {STATISTIC_BAR_HEIGHT} from '../const';
import {StatisticFilterType} from '../types';

const createChart = (statisticCtx, data) => {
  statisticCtx.height = STATISTIC_BAR_HEIGHT * data.genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: data.genres,
      datasets: [{
        data: data.counts,
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
  });
};

const createRankTemplate = (rank) => (
  `<p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
  </p>`
);

const createStatisticsTemplate = (data, rank) => (
  `<section class="statistic">
    ${data.viewsCount ? createRankTemplate(rank) : ''}

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-all-time"
        value="all-time"
        ${(data.target === 'all-time') ? 'checked' : ''}
      >
      <label for="statistic-all-time"
        class="statistic__filters-label">All time</label>

      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-today"
        value="today"
        ${(data.target === 'today') ? 'checked' : ''}
      >
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-week"
        value="week"
        ${(data.target === 'week') ? 'checked' : ''}
      >
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-month"
        value="month"
        ${(data.target === 'month') ? 'checked' : ''}
      >
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-year"
        value="year"
        ${(data.target === 'year') ? 'checked' : ''}
      >
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${data.viewsCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">
          ${data.totalDuration.h ? `${data.totalDuration.h} <span class="statistic__item-description">h</span>` : ''}
          ${data.totalDuration.m} <span class="statistic__item-description">m</span>
        </p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${data.topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
);

export default class StatisticView extends SmartView {
  constructor(rank, films) {
    super();
    this._rank = rank;
    this._films = getWatchedFilms(films);
    this._data = StatisticView.parseFilmsToData(this._films);
    this._chart = null;
    this._setChart();

    this._filtersChangeHandler = this._filtersChangeHandler.bind(this);
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._filtersChangeHandler);
  }

  getTemplate() {
    return createStatisticsTemplate(this._data, this._rank);
  }

  restoreHandlers() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._filtersChangeHandler);
    this._setChart();
  }

  _filtersChangeHandler(evt) {
    this._data = StatisticView.parseFilmsToData(getFilmsByPeriod(
      this._films,
      StatisticFilterType[applyUpperSnakeCase(evt.target.value)].shorthand),
    );

    evt.preventDefault();
    this.updateData({...this._data, target: evt.target.value});
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._chart = createChart(statisticCtx, this._data);
  }

  static parseFilmsToData(films) {
    return {
      target: StatisticFilterType.ALL_TIME.name,
      viewsCount: films.length,
      totalDuration: getTotalDuration(films),
      ...getChartOptions(films),
    };
  }
}

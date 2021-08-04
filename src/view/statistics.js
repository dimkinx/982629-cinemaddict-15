export const createStatisticsTemplate = (allFilmsCount) => `<p>${allFilmsCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} movies inside</p>`;

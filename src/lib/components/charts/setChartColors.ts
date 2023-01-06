import type { Chart as ChartJS } from 'chart.js';

export const setPieChartColors = (chart: ChartJS) => {
	const style = getComputedStyle(document.body);

	const borderColor = style.getPropertyValue('--clr-border-primary');
	const backgroundColors: string[] = [];

	backgroundColors.push(style.getPropertyValue('--clr-primary-50'));
	backgroundColors.push(style.getPropertyValue('--clr-secondary-50'));
	backgroundColors.push(style.getPropertyValue('--clr-tertiary-50'));
	backgroundColors.push(style.getPropertyValue('--clr-primary-200'));
	backgroundColors.push(style.getPropertyValue('--clr-secondary-200'));
	backgroundColors.push(style.getPropertyValue('--clr-tertiary-200'));
	backgroundColors.push(style.getPropertyValue('--clr-primary-400'));
	backgroundColors.push(style.getPropertyValue('--clr-secondary-400'));
	backgroundColors.push(style.getPropertyValue('--clr-tertiary-400'));
	backgroundColors.push(style.getPropertyValue('--clr-primary-600'));
	backgroundColors.push(style.getPropertyValue('--clr-secondary-600'));
	backgroundColors.push(style.getPropertyValue('--clr-tertiary-600'));

	chart.options.borderColor = borderColor;
	chart.options.backgroundColor = backgroundColors;

	chart.update();
};

export const setLineChartColors = (chart: ChartJS) => {
	const style = getComputedStyle(document.body);

	const primaryColor = style.getPropertyValue('--clr-primary-main');
	const backgroundHover = style.getPropertyValue('--clr-background-primary');

	chart.options.borderColor = primaryColor;
	chart.options.pointBorderColor = primaryColor;
	chart.options.pointHoverBackgroundColor = backgroundHover;

	chart.update();
};

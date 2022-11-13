import React from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';

const BarChartx = ({ data = [] }) => {
	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
	const getRandomColor = () => {
		return COLORS[Math.floor(Math.random() * COLORS.length)];
	};
	return (
		<BarChart
			width={500}
			height={300}
			data={data}
			margin={{
				top: 5,
				right: 30,
				left: 20,
				bottom: 5
			}}>
			<CartesianGrid strokeDasharray='3 3' />
			<XAxis dataKey='name' />
			<YAxis />
			<Tooltip />
			<Legend />
			<Bar dataKey='value' fill={getRandomColor()} />
		</BarChart>
	);
};

export default BarChartx;

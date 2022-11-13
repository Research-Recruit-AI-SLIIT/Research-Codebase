import React from 'react';
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';

const LineChartx = ({ data, xDataKey = 'name', yDataKey = 'value' }) => {
	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
	const getRandomColor = () => {
		return COLORS[Math.floor(Math.random() * COLORS.length)];
	};
	return (
		<LineChart
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
			<XAxis dataKey={xDataKey} />
			<YAxis />
			<Tooltip />
			<Legend />
			<Line
				type='monotone'
				dataKey={yDataKey}
				stroke={getRandomColor()}
				strokeWidth={3}
			/>
		</LineChart>
	);
};

export default LineChartx;

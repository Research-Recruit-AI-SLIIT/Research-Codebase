import React, { PureComponent } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

const PieChartx = ({ data = [] }) => {
	const COLORS = ['#00C49F', '#dc3545', '#FFBB28', '#FF8042'];
	return (
		<PieChart width={500} height={300}>
			<Pie
				data={data}
				cx='50%'
				cy='50%'
				labelLine={false}
				label={renderCustomizedLabel}
				outerRadius={150}
				fill='#8884d8'
				dataKey='value'>
				{data.map((entry, index) => (
					<Cell
						key={`cell-${index}`}
						fill={COLORS[index % COLORS.length]}
					/>
				))}
			</Pie>
		</PieChart>
	);
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
	index,
	name
}) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.4;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
			x={x}
			y={y}
			fill='black'
			textAnchor={x > cx ? 'start' : 'end'}
			dominantBaseline='central'>
			{`${(percent * 100).toFixed(0)}%`}

			{name}
		</text>
	);
};

export default PieChartx;

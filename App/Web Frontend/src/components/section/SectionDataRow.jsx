import React from 'react';
import { getColorByWord } from '../../utils/utils';

const SectionDataRow = ({ title, value, highlighted }) => {
	return (
		<div
			style={{
				padding: highlighted ? '10px 5px' : '0 5px',
				backgroundColor: highlighted
					? getColorByWord(value)
					: 'transparent',
				borderRadius: '5px'
			}}>
			{title} : {value}
		</div>
	);
};

export default SectionDataRow;

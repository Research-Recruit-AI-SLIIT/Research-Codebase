import React from 'react';

const InterviewCardRow = ({ label, value }) => {
	return (
		<div className='col-md-12'>
			<span className='interview-card-row-label'>{label} : </span>
			<span className='interview-card-row-value'>{value}</span>
		</div>
	);
};

export default InterviewCardRow;

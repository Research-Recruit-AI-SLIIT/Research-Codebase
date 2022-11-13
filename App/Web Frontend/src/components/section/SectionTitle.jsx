import React from 'react';

const SectionTitle = ({ title }) => {
	return (
		<div className='row mb-3'>
			<div className='col-md-12'>
				<h3>{title}</h3>
			</div>
		</div>
	);
};

export default SectionTitle;

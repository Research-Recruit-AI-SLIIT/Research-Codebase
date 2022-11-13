import React from 'react';
import Card from '../components/card/Card';

const FormLayout = ({ title, cardImage, ...props }) => {
	return (
		<div className='container'>
			<div className='row '>
				<div className='col-md-12'>
					<span className='page-title'>{title}</span>
				</div>
			</div>
			<div className='row mt-4'>
				<div className='col-md-12'>
					<Card
						imageUrl={
							cardImage
								? 'https://source.unsplash.com/random/?organization'
								: null
						}>
						{props.children}
					</Card>
				</div>
			</div>
		</div>
	);
};

export default FormLayout;

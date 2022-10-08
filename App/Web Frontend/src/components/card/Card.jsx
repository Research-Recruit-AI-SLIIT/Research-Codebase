import React from 'react';
import './Card.styles.css';

const Card = ({ imageUrl, ...props }) => {
	return (
		<div className='card'>
			{imageUrl && (
				<div
					className='card-form-img-top'
					alt='Card image'
					style={{
						backgroundImage: `url(${imageUrl})`
					}}></div>
			)}
			<div className='card-body'>{props.children}</div>
		</div>
	);
};

export default Card;

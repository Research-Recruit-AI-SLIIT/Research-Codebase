import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuItem.styles.css';

const MenuItem = ({ path, name, requireAuth }) => {
	const [image, setImage] = useState(null);
	const styles = {
		background: `linear-gradient(
      to left,
      rgba(255, 255, 255, 0.37) 0px,
      rgba(255, 255, 255, 1) 90%,
      rgba(255, 255, 255, 1) 180px
    ),
    url(${image}) no-repeat
      center`
	};
	const getImage = async () => {
		const response = await fetch(
			`https://source.unsplash.com/random/480x360/?${name}`
		);
		setImage(response.url);
	};
	useEffect(() => {
		getImage();
	}, [path]);
	return (
		<Link
			to={path}
			className={`col-md-3 ${
				requireAuth ? 'mt-4' : ''
			} td-none menu-item mx-4 my-2 `}
			style={styles}>
			<div className='card mi-card'>
				<div className='card-body'>
					<h5 className='card-title'>{name}</h5>
				</div>
			</div>
		</Link>
	);
};

export default MenuItem;

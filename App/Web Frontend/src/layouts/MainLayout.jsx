import React from 'react';
import Navbar from '../components/shared/nav/Navbar';

const MainLayout = ({ ...props }) => {
	return (
		<>
			<Navbar />
			<div className='container'>{props.children}</div>
		</>
	);
};

export default MainLayout;

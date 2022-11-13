import React from 'react';
import Footer from '../components/footer/Footer';
import Navbar from '../components/shared/nav/Navbar';

const MainLayout = ({ ...props }) => {
	const currentPath = window.location.pathname;

	return (
		<>
			<Navbar />
			{currentPath === '/' && (
				<div className='home-image'>
					{/* <img
						src=''
						width={'100 vw'}
					/> */}
				</div>
			)}
			<div className='container'>{props.children}</div>
			{currentPath === '/' && <Footer />}
		</>
	);
};

export default MainLayout;

import React, { useContext } from 'react';
import MenuItem from '../../components/menu-item/MenuItem';
import { AuthContext } from '../../store/auth';
import { getRouteValues } from '../../utils/utils';

const Home = () => {
	const { getRole, isAuthenticated } = useContext(AuthContext);
	const role = getRole();
	const isAuth = isAuthenticated();

	const routes = getRouteValues(role);
	return (
		<div className='row'>
			<div className='col-md-12 text-center mb-1 mt-3'>
				<span className='home-page-title'>
					Get Started With Recruit AI
				</span>
			</div>
			<div className='col-md-12'>
				<div className='row justify-content-center'>
					{routes.map((route, index) =>
						route.hide || route.requireAuth != isAuth ? null : (
							<MenuItem
								key={index}
								name={route.name}
								path={route.path}
								requireAuth={route.requireAuth}
							/>
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;

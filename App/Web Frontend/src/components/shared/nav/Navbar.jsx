import React, { useContext } from 'react';
import { AuthContext } from '../../../store/auth';
import { Link, useLocation } from 'react-router-dom';
import {
	commonRoutes,
	adminRoutes,
	candidateRoutes,
	recruiterRoutes
} from '../../../routes';
import './Navbar.styles.css';
import ProfileIcon from '../../profile-icon/ProfileIcon';

const Navbar = () => {
	const { getRole, isAuthenticated } = useContext(AuthContext);
	const path = useLocation().pathname;
	const role = getRole();
	const isAuth = isAuthenticated();

	const routes = [...commonRoutes];
	if (role === 'admin') {
		routes.push(...adminRoutes);
	} else if (role === 'recruiter') {
		routes.push(...recruiterRoutes);
	} else if (role === 'candidate') {
		routes.push(...candidateRoutes);
	}
	return (
		<div className='navigation-wrap bg-light start-header start-style'>
			<div className='container'>
				<div className='row'>
					<div className='col-12'>
						<nav className='navbar navbar-expand-md navbar-light'>
							<Link className='navbar-brand' to='/'>
								<img
									src='https://i.imgur.com/m24Yavo.jpg'
									alt=''
								/>
							</Link>

							<button
								className='navbar-toggler'
								type='button'
								data-toggle='collapse'
								data-target='#navbarSupportedContent'
								aria-controls='navbarSupportedContent'
								aria-expanded='false'
								aria-label='Toggle navigation'>
								<span className='navbar-toggler-icon'></span>
							</button>

							<div
								className='collapse navbar-collapse'
								id='navbarSupportedContent'>
								<ul className='navbar-nav ml-auto py-4 py-md-0'>
									{routes.map((route, index) => {
										return route.hide ||
											route.requireAuth !=
												isAuth ? null : (
											<li
												className={`nav-item pl-4 pl-md-0 ml-0 ml-md-4 ${
													path === route.path
														? 'active'
														: ''
												}`}
												key={index}>
												<Link
													className='nav-link'
													to={route.path}>
													{route.name}
												</Link>
											</li>
										);
									})}
								</ul>

								{isAuth && <ProfileIcon />}
							</div>
						</nav>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;

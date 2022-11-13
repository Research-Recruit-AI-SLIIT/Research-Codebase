import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../store/auth';

const ProfileIcon = () => {
	const { logout } = useContext(AuthContext);
	return (
		<ul className='navbar-nav ml-3 py-4 py-md-0'>
			<li className='dropdown'>
				<a
					className='nav-link dropdown-toggle'
					href='#'
					id='navbarDropdownMenuLink'
					role='button'
					data-toggle='dropdown'
					aria-haspopup='true'
					aria-expanded='false'>
					<img
						src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRbiMjUoOxJCAMB9poSO2wLg34m7OxmyaT-A&usqp=CAU'
						width='40'
						height='40'
						className='rounded-circle'
					/>
				</a>
				<div
					className='dropdown-menu'
					aria-labelledby='navbarDropdownMenuLink'>
					<Link className='dropdown-item' to='/'>
						Dashboard
					</Link>
					<Link className='dropdown-item' to='/'>
						Edit Profile
					</Link>
					<button className='dropdown-item' onClick={logout}>
						Log Out
					</button>
				</div>
			</li>
		</ul>
	);
};

export default ProfileIcon;

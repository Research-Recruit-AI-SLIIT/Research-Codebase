import React from 'react';

const AuthLayout = ({ title, ...props }) => {
	return (
		<div className='auth-container'>
			<div className='row auth-row'>
				<div className='col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-6 offset-xl-3'>
					<h2 className='text-center text-dark mt-1'>{title}</h2>
					<div className='card my-5'>{props.children}</div>
				</div>
			</div>
		</div>
	);
};

export default AuthLayout;

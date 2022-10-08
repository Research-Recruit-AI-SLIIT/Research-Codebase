import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../store/auth';

const NoAuth = ({ ...props }) => {
	const { isAuthenticated } = useContext(AuthContext);
	const isAuth = isAuthenticated();
	if (isAuth) {
		return <Navigate replace to='/' />;
	}
	return <>{props.children}</>;
};

export default NoAuth;

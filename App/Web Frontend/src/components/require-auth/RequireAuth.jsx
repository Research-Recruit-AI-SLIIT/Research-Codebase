import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../store/auth';

const RequireAuth = ({ role, ...props }) => {
	const { isAuthenticated, getRole } = useContext(AuthContext);
	const isAuth = isAuthenticated();
	const currentRole = getRole();
	if (!isAuth) {
		return <Navigate to='/login' replace />;
	} else {
		if (role && role !== currentRole) {
			return <Navigate to='/' replace />;
		}
	}
	return props.children;
};

export default RequireAuth;

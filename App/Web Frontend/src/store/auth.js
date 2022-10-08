import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTime } from '../utils/utils';
const AuthContext = createContext();
const { Provider } = AuthContext;

const INITIAL_AUTH_STATE = {
	isAuthenticated: false,
	token: null,
	refreshToken: null,
	refreshTokenExpiresAt: null,
	user: null,
	expiresAt: null
};

const AuthProvider = ({ children }) => {
	const navigate = useNavigate();
	const [authState, setAuthState] = useState({ ...INITIAL_AUTH_STATE });

	useEffect(() => {
		const token = localStorage.getItem('token');
		const refreshToken = localStorage.getItem('refreshToken');
		const user = localStorage.getItem('user');
		const expiresAt = localStorage.getItem('expiresAt');

		setAuthState({
			...authState,
			token,
			refreshToken,
			expiresAt,
			user: user ? JSON.parse(user) : {}
		});
	}, []);

	const setAuthInfo = ({ tokens, user }) => {
		const { token, expires } = tokens.access;
		const refreshToken = tokens.refresh.token;
		const expiresAt = getTime(expires);
		const refreshTokenExpiresAt = getTime(tokens.refresh.expires);
		localStorage.setItem('token', token);
		localStorage.setItem('refreshToken', refreshToken);
		localStorage.setItem('refreshTokenExpiresAt', refreshTokenExpiresAt);
		localStorage.setItem('user', JSON.stringify(user));
		localStorage.setItem('expiresAt', expiresAt);
		setAuthState({
			...authState,
			isAuthenticated: true,
			token,
			refreshToken,
			refreshTokenExpiresAt,
			user,
			expiresAt
		});
		navigate('/');
	};

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('refreshTokenExpiresAt');
		localStorage.removeItem('user');
		localStorage.removeItem('expiresAt');
		localStorage.clear();
		setAuthState({ ...INITIAL_AUTH_STATE });
		navigate('/login');
	};

	const isAuthenticated = () => {
		const token = localStorage.getItem('token');
		const expiresAt = localStorage.getItem('expiresAt');
		if (!token || !expiresAt) {
			return false;
		}

		return new Date().getTime() < expiresAt;
	};

	const isAdmin = () => {
		return authState.user?.role === 'admin';
	};

	const getRole = () => {
		const user = localStorage.getItem('user');
		return user ? JSON.parse(user).role : authState.user?.role;
	};

	const getUser = () => {
		const user = localStorage.getItem('user');
		return authState.user
			? authState.user
			: user
			? JSON.parse(user)
			: logout();
	};

	const setUser = (user) => {
		localStorage.setItem('user', JSON.stringify(user));
		setAuthState({
			...authState,
			user
		});
	};

	return (
		<Provider
			value={{
				authState,
				setAuthInfo: (authInfo) => setAuthInfo(authInfo),
				logout,
				isAuthenticated,
				isAdmin,
				getRole,
				getUser,
				setUser
			}}>
			{children}
		</Provider>
	);
};

export { AuthContext, AuthProvider };

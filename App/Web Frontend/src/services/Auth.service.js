import request from '../utils/axios.util';

const login = async (email, password) => {
	const response = await request({
		method: 'post',
		url: 'auth/login',
		data: {
			email,
			password
		}
	});
	return response;
};

const register = async (payload) => {
	const response = await request({
		method: 'post',
		url: 'auth/register',
		data: {
			...payload
		}
	});
	return response;
};

const logout = async () => {
	const response = await request({
		method: 'post',
		url: '/logout'
	});
	return response;
};

const refreshToken = async () => {
	const response = await request({
		method: 'post',
		url: '/refresh-token'
	});
	return response;
};

const AuthService = {
	login,
	register,
	logout,
	refreshToken
};

export default AuthService;

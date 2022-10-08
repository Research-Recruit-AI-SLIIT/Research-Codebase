import NoAuth from '../components/require-auth/NoAuth';
import RequireAuth from '../components/require-auth/RequireAuth';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/home/Home';

export const commonRoutes = [
	{
		path: '/login',
		name: 'Login',
		component: (
			<NoAuth>
				<Login />
			</NoAuth>
		),
		requireAuth: false
	},
	{
		path: '/register',
		name: 'Register',
		component: <Register />,
		requireAuth: false
	},
	{
		path: '/',
		name: 'Home',
		component: (
			<RequireAuth>
				<Home />
			</RequireAuth>
		),
		requireAuth: true
	}
];

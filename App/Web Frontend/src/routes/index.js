import { adminRoutes } from './admin-routes';
import { commonRoutes } from './common-routes';
import { candidateRoutes } from './candidate-routes';
import { recruiterRoutes } from './recruiter-routes';
import { Route } from 'react-router-dom';
import NotFound from '../pages/error/NotFound';

export const getRoutes = (role) => {
	const routes = [...commonRoutes];
	if (role === 'admin') {
		routes.push(...adminRoutes);
	} else if (role === 'recruiter') {
		routes.push(...recruiterRoutes);
	} else if (role === 'candidate') {
		routes.push(...candidateRoutes);
	}
	const routeItems = routes.map((route, index) => {
		return (
			<Route
				key={index}
				exact
				path={route.path}
				element={route.component}
			/>
		);
	});

	routeItems.push(
		<Route key={routes.length} path='*' element={<NotFound />} />
	);
	return routeItems;
};

export { commonRoutes } from './common-routes';
export { adminRoutes } from './admin-routes';
export { recruiterRoutes } from './recruiter-routes';
export { candidateRoutes } from './candidate-routes';

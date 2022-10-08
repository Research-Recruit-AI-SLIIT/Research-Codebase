import RequireAuth from '../components/require-auth/RequireAuth';
import Interview from '../pages/interview/Interview';
import ViewInterviews from '../pages/interview/ViewInterviews';

export const candidateRoutes = [
	{
		path: '/view-interviews',
		name: 'View Interviews',
		component: (
			<RequireAuth role={'candidate'}>
				<ViewInterviews />
			</RequireAuth>
		),
		requireAuth: true
	},
	{
		path: '/interview/:id',
		name: 'Interview',
		component: (
			<RequireAuth role={'candidate'}>
				<Interview />
			</RequireAuth>
		),
		requireAuth: true,
		hide: true
	}
];

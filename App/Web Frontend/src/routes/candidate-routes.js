import RequireAuth from '../components/require-auth/RequireAuth';
import Interview from '../pages/interview/Interview';
import ViewInterviews from '../pages/interview/ViewInterviews';
import MyInterviews from '../pages/MyInterviews/MyInterviews';
import MyInterviewSession from '../pages/MyInterviews/MyInterviewSession';

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
	},
	{
		path: '/my-interviews',
		name: 'My Interviews',
		component: (
			<RequireAuth role={'candidate'}>
				<MyInterviews />
			</RequireAuth>
		),
		requireAuth: true
	},
	{
		path: '/my-interview-session/:id',
		name: 'My Interview Session',
		component: (
			<RequireAuth role={'candidate'}>
				<MyInterviewSession />
			</RequireAuth>
		),
		requireAuth: true,
		hide: true
	}
];

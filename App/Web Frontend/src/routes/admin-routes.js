import RequireAuth from '../components/require-auth/RequireAuth';
import AddInterview from '../pages/interview/AddInterview';
import ManageInterviews from '../pages/interview/ManageInterviews';
import UpdateInterview from '../pages/interview/UpdateInterview';
import MyInterviews from '../pages/MyInterviews/MyInterviews';
import MyInterviewSession from '../pages/MyInterviews/MyInterviewSession';
import AddOrganization from '../pages/organization/AddOrganization';
import AddQuestions from '../pages/questions/AddQuestions';

export const adminRoutes = [
	{
		path: '/add-interview',
		name: 'Add Interview',
		component: (
			<RequireAuth role={'admin'}>
				<AddInterview />
			</RequireAuth>
		),
		requireAuth: true
	},
	{
		path: '/add-organization',
		name: 'Add Organization',
		component: (
			<RequireAuth role={'admin'}>
				<AddOrganization />
			</RequireAuth>
		),
		requireAuth: true
	},
	{
		path: '/add-questions/:id',
		name: 'Add Questions',
		component: (
			<RequireAuth role={'admin'}>
				<AddQuestions />
			</RequireAuth>
		),
		requireAuth: true,
		hide: true
	},
	{
		path: '/manage-interviews',
		name: 'Manage Interviews',
		component: (
			<RequireAuth role={'admin'}>
				<ManageInterviews />
			</RequireAuth>
		),
		requireAuth: true
	},
	{
		path: '/update-interview/:id',
		name: 'Update Interview',
		component: (
			<RequireAuth role={'admin'}>
				<AddQuestions />
			</RequireAuth>
		),
		requireAuth: true,
		hide: true
	},
	{
		path: '/completed-interviews',
		name: 'Completed Interviews',
		component: (
			<RequireAuth role={'admin'}>
				<MyInterviews />
			</RequireAuth>
		),
		requireAuth: true
	},
	{
		path: '/my-interview-session/:id',
		name: 'My Interview Session',
		component: (
			<RequireAuth role={'admin'}>
				<MyInterviewSession />
			</RequireAuth>
		),
		requireAuth: true,
		hide: true
	}
];

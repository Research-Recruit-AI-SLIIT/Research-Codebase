import RequireAuth from '../components/require-auth/RequireAuth';
import AddInterview from '../pages/interview/AddInterview';
import ManageInterviews from '../pages/interview/ManageInterviews';
import UpdateInterview from '../pages/interview/UpdateInterview';
import MyInterviews from '../pages/MyInterviews/MyInterviews';
import MyInterviewSession from '../pages/MyInterviews/MyInterviewSession';
import AddQuestions from '../pages/questions/AddQuestions';

export const recruiterRoutes = [
	{
		path: '/add-interview',
		name: 'Add Interview',
		component: (
			<RequireAuth role={'recruiter'}>
				<AddInterview />
			</RequireAuth>
		),
		requireAuth: true
	},
	{
		path: '/add-questions/:id',
		name: 'Add Questions',
		component: (
			<RequireAuth role={'recruiter'}>
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
			<RequireAuth role={'recruiter'}>
				<ManageInterviews />
			</RequireAuth>
		),
		requireAuth: true
	},
	{
		path: '/update-interview/:id',
		name: 'Update Interview',
		component: (
			<RequireAuth role={'recruiter'}>
				<UpdateInterview />
			</RequireAuth>
		),
		requireAuth: true,
		hide: true
	},
	{
		path: '/completed-interviews',
		name: 'Completed Interviews',
		component: (
			<RequireAuth role={'recruiter'}>
				<MyInterviews />
			</RequireAuth>
		),
		requireAuth: true
	},
	{
		path: '/my-interview-session/:id',
		name: 'My Interview Session',
		component: (
			<RequireAuth role={'recruiter'}>
				<MyInterviewSession />
			</RequireAuth>
		),
		requireAuth: true,
		hide: true
	}
];

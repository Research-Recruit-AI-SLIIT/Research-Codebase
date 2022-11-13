import request from '../utils/axios.util';
import { getAuthHeader } from '../utils/utils';

const startInterviewSession = (interviewID) => {
	return request({
		method: 'post',
		url: `interview-session`,
		headers: getAuthHeader(),
		data: {
			interviewID
		}
	});
};

const answerQuestion = (answerId, answerUrl) => {
	return request({
		method: 'put',
		url: `interview-answer/answer`,
		headers: getAuthHeader(),
		data: {
			answerId,
			answerUrl
		}
	});
};

const finishInterview = (interviewSessionId) => {
	return request({
		method: 'put',
		url: `interview-session/finish`,
		headers: getAuthHeader(),
		data: {
			interviewSessionId
		}
	});
};

const getMyInterviews = () => {
	return request({
		method: 'get',
		url: `interview-session/my-interviews`,
		headers: getAuthHeader()
	});
};

const getInterviewSession = (interviewSessionId) => {
	return request({
		method: 'get',
		url: `interview-session/get/${interviewSessionId}`,
		headers: getAuthHeader()
	});
};

const getRecruiterInterviews = () => {
	return request({
		method: 'get',
		url: `interview-session/get-recruiter-interviews`,
		headers: getAuthHeader()
	});
};
const InterviewSessionService = {
	startInterviewSession,
	answerQuestion,
	finishInterview,
	getMyInterviews,
	getInterviewSession,
	getRecruiterInterviews
};

export default InterviewSessionService;

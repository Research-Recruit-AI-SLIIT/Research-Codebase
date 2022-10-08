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

const InterviewSessionService = {
	startInterviewSession,
	answerQuestion,
	finishInterview
};

export default InterviewSessionService;

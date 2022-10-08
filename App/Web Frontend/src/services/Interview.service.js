import request from '../utils/axios.util';
import { getAuthHeader } from '../utils/utils';

export const getInterviewCategories = () => {
	return request({
		url: 'interview/get-categories',
		method: 'get'
	});
};

export const getInterviews = () => {
	return request({
		url: 'interview/get-interviews',
		method: 'get'
	});
};

export const getInterview = (id) => {
	return request({
		url: 'interview/get-interview/id/' + id,
		method: 'get'
	});
};

export const createInterview = (payload) => {
	return request({
		url: 'interview/create-interview',
		method: 'post',
		headers: getAuthHeader(),
		data: {
			...payload
		}
	});
};

export const updateInterview = (payload) => {
	return request({
		url: 'interview/update',
		method: 'put',
		data: {
			...payload
		}
	});
};

export const deleteInterview = (id) => {
	return request({
		url: 'interview/delete-interview/' + id,
		method: 'delete',
		headers: getAuthHeader()
	});
};

const getMyManagedInterviews = () => {
	return request({
		url: 'interview/get-interviews-by-creator',
		method: 'get',
		headers: getAuthHeader()
	});
};

const InterviewService = {
	getInterviewCategories,
	getInterviews,
	getInterview,
	createInterview,
	updateInterview,
	deleteInterview,
	getMyManagedInterviews
};

export default InterviewService;

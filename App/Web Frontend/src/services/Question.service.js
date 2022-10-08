import request from '../utils/axios.util';
import { getAuthHeader } from '../utils/utils';

const addQuestion = (payload) => {
	return request({
		url: 'interview/add-question-to-interview',
		method: 'put',
		headers: getAuthHeader(),
		data: {
			...payload
		}
	});
};

const updateQuestion = (payload) => {
	return request({
		url: 'interview/update-interview-question',
		method: 'put',
		headers: getAuthHeader(),
		data: {
			...payload
		}
	});
};

const deleteQuestion = (id) => {
	return request({
		url: 'interview/delete-interview-question/' + id,
		method: 'delete',
		headers: getAuthHeader()
	});
};

const QuestionService = {
	addQuestion,
	updateQuestion,
	deleteQuestion
};

export default QuestionService;

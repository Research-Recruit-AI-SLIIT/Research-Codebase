import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import QuestionManage from '../../components/question/QuestionManage';
import QuestionsList from '../../components/questions-list/QuestionsList';
import { Alert, Loading } from '../../components/shared';
import FormLayout from '../../layouts/Form.layout';
import InterviewService from '../../services/Interview.service';
import QuestionService from '../../services/Question.service';

const AddQuestions = ({}) => {
	const { id } = useParams();
	const [interview, setInterview] = useState({});
	const [questions, setQuestions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		InterviewService.getInterview(id)
			.then((res) => {
				setInterview(res.interview);
				// sort questions by questionOrder
				const questions = res.interview.questions.sort(
					(a, b) => a.questionOrder - b.questionOrder
				);
				setQuestions(questions);
			})
			.catch((err) => {
				toast(err.data.message, { type: 'error' });
				setError(err.data.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [id]);

	const onSubmit = (question) => {
		delete question._id;
		QuestionService.addQuestion({ ...question, interviewId: id })
			.then((res) => {
				const questions = res.interview.questions.sort(
					(a, b) => a.questionOrder - b.questionOrder
				);
				setQuestions(questions);
				toast('Question Added successfully', { type: 'success' });
			})
			.catch((err) => {
				toast(err.data.message, { type: 'error' });
			});
	};

	if (!!error) {
		return (
			<div className='mt-5'>
				<Alert message={error} type='error' />
			</div>
		);
	}
	return (
		<FormLayout
			title={
				<span>
					Add Questions for interview:{' '}
					{loading ? <Loading /> : interview.name}
				</span>
			}>
			<QuestionManage questionObj={{}} onSubmit={onSubmit} />

			<hr />

			<h3>Questions</h3>
			{loading ? <Loading /> : <QuestionsList questions={questions} />}
		</FormLayout>
	);
};

export default AddQuestions;

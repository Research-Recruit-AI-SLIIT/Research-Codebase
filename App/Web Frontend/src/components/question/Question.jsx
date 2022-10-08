import React, { useState } from 'react';
import { FaEdit, FaTimesCircle } from 'react-icons/fa';
import QuestionView from './QuestionView';
import QuestionService from '../../services/Question.service';
import { toast } from 'react-toastify';
import './question.styles.css';
import QuestionManage from './QuestionManage';

const Question = ({ question }) => {
	const [edit, setEdit] = useState(false);
	const [q, setQuestion] = useState(question);
	const onCancel = () => {
		setEdit(false);
	};

	const onUpdate = async (payload) => {
		await QuestionService.updateQuestion(payload)
			.then((res) => {
				setEdit(false);
				setQuestion(payload);
				toast('Question updated successfully', { type: 'success' });
			})
			.catch((err) => {
				toast('Error updating question', { type: 'error' });
			});
	};
	return (
		<div className='col-md-12'>
			{edit ? (
				<FaTimesCircle
					onClick={() => setEdit(!edit)}
					className='question-icon icon-close'
				/>
			) : (
				<FaEdit
					onClick={() => setEdit(!edit)}
					className='question-icon icon-edit'
				/>
			)}
			{edit ? (
				<QuestionManage
					questionObj={q}
					onCancel={onCancel}
					onSubmit={onUpdate}
				/>
			) : (
				<QuestionView question={q} />
			)}
		</div>
	);
};

export default Question;

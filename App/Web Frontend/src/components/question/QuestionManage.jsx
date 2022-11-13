import React, { useState } from 'react';
import { Alert, CustomSelect, Input, Loading } from '../shared';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import constants from '../../utils/constants';

const QuestionManage = ({ questionObj, onCancel, onSubmit }) => {
	const {
		_id = '',
		question = '',
		questionOrder = '',
		sampleAnswers = [],
		questionType = '',
		knowledgeArea = ''
	} = questionObj;

	const [loading, setLoading] = useState(false);
	const [_question, setQuestion] = useState({
		_id,
		question,
		questionOrder,
		sampleAnswers,
		questionType,
		knowledgeArea
	});

	const [errors, setErrors] = useState({
		question: '',
		questionOrder: '',
		sampleAnswers: '',
		questionApi: '',
		knowledgeArea: ''
	});

	const [sampleAnswer, setSampleAnswer] = useState('');

	const onChange = (e) => {
		setQuestion({ ..._question, [e.target.name]: e.target.value });
	};

	const onSampleAnswerChange = (e) => {
		setSampleAnswer(e.target.value);
	};

	const onAddSampleAnswer = (e) => {
		e.preventDefault();
		if (!sampleAnswer) {
			setErrors({
				...errors,
				sampleAnswers: 'Sample answer is required'
			});
			return;
		}
		const sampleAnswers = _question.sampleAnswers;
		sampleAnswers.push(sampleAnswer);
		setQuestion({ ..._question, sampleAnswers });
		setSampleAnswer('');
	};

	const onRemoveSampleAnswer = (index) => {
		const sampleAnswers = _question.sampleAnswers;
		sampleAnswers.splice(index, 1);
		setQuestion({ ..._question, sampleAnswers });
	};

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		if (validate()) {
			setLoading(true);
			setQuestion({
				_id: '',
				question: '',
				questionOrder: '',
				sampleAnswers: [],
				knowledgeArea: ''
			});
			await onSubmit(_question);
			setLoading(false);
		} else {
		}
	};

	const validate = () => {
		let isValid = true;
		const errors = {};
		if (!_question.question) {
			errors.question = 'Question is required';
			isValid = false;
		}
		if (!_question.questionOrder) {
			errors.questionOrder = 'Question order is required';
			isValid = false;
		}

		setErrors(errors);
		return isValid;
	};

	return (
		<div className='row question-wrapper '>
			<form onSubmit={onSubmitHandler} className='col-md-12'>
				<div className='form-row'>
					<div className='col-md-10'>
						<label className='form-label'>
							Question <span className='text-danger'>*</span>
						</label>
						<textarea
							className='form-control p-13-px'
							value={_question.question}
							name='question'
							id=''
							onChange={onChange}
							placeholder='Enter question'
							cols='30'
							rows='4'
						/>
						{!!errors.question && (
							<div className='input-error'>{errors.question}</div>
						)}
					</div>
					<div className='col-md-2'>
						<div className='row'>
							<div className='col-md-12'>
								<Input
									label='Question Order'
									name='questionOrder'
									className='mb-0'
									value={_question.questionOrder}
									onChange={onChange}
									placeHolder='1'
									min={1}
									type='number'
									isError={!!errors.questionOrder}
									errorMessage={errors.questionOrder}
								/>
							</div>
							<div className='col-md-12'>
								<CustomSelect
									label='Question Type'
									isAsync={false}
									value={_question.questionType}
									onSelect={(e) =>
										setQuestion({
											..._question,
											questionType: e
										})
									}
									data={constants.questionTypes}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className='form-row'>
					<div className='col-md-12'>
						<Input
							label='Knowledge Area'
							name='knowledgeArea'
							className='mt-1'
							value={_question.knowledgeArea}
							onChange={onChange}
							placeHolder='Knowledge Area'
							type='text'
							isError={!!errors.knowledgeArea}
							errorMessage={errors.knowledgeArea}
						/>
					</div>
				</div>
				<div className='form-row mt-2'>
					<div className='col-md-12 faded-title'>
						<h5>Sample answers</h5>
					</div>
					<div className='col-md-12'>
						{_question.sampleAnswers.length > 0 ? (
							<ul>
								{_question.sampleAnswers.map(
									(answer, index) => (
										<li key={index} className='answer'>
											{answer}
											<span>
												<FaTrash
													color='red'
													onClick={() =>
														onRemoveSampleAnswer(
															index
														)
													}
												/>
											</span>
										</li>
									)
								)}
							</ul>
						) : (
							<div className='empty-sample-answer'>
								No sample answers
							</div>
						)}
						<div className='form-row'>
							<Input
								className='col-md-8'
								name='sampleAnswer'
								value={sampleAnswer}
								onChange={onSampleAnswerChange}
								placeHolder='Enter sample answer'
								isError={!!errors.sampleAnswers}
								errorMessage={errors.sampleAnswers}
							/>
							<button
								onClick={onAddSampleAnswer}
								className='btn btn-primary col-md-4 mb-3'>
								Add sample answer
							</button>
						</div>
					</div>
				</div>

				<hr />
				<div className='row justify-content-between'>
					<div className='col-md-4 text-align-end '>
						<button
							className='btn btn-light w-100 border border-1 border-dark'
							onClick={onCancel}>
							cancel
						</button>
					</div>
					<div className='col-md-4'>
						<button className='btn btn-black w-100' type='submit'>
							{loading ? <Loading /> : 'Save'}
						</button>
					</div>
				</div>

				{errors.questionApi && (
					<div className='row'>
						<div className='col-md-12'>
							<Alert message={errors.questionApi} type='danger' />
						</div>
					</div>
				)}
			</form>
		</div>
	);
};

export default QuestionManage;

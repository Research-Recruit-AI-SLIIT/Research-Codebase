import React from 'react';
import Question from '../question/Question';

const QuestionsList = ({ questions }) => {
	return (
		<div className='row'>
			{questions.length > 0 ? (
				questions.map((question, index) => (
					<Question key={index} question={question} />
				))
			) : (
				<div className='col-md-12'>
					<h4 className='text-danger'>No questions yet</h4>
				</div>
			)}
		</div>
	);
};

export default QuestionsList;

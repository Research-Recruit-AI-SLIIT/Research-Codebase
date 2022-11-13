import React from 'react';

const QuestionView = ({ question }) => {
	return (
		<div className='row question-wrapper q-view '>
			<div className='col-md-12'>
				<div className='form-row'>
					<div className='col-md-9 border-1'>
						<label className='form-label h5 faded-title'>
							Question
						</label>
						<div className='question-title'>
							{question.question}
						</div>
					</div>
					<div className='col-md-2 offset-md-1'>
						<div className='row gap-1'>
							<div className='col-md-12 border-1'>
								<label className='form-label faded-title'>
									Question Order
								</label>
								<div className='question-type'>
									{question.questionOrder}
								</div>
							</div>
							<div className='col-md-12 border-1'>
								<label className='form-label faded-title'>
									Question Type
								</label>
								<div className='question-type'>
									{question.questionType}
								</div>
							</div>
						</div>
					</div>
				</div>
				{question.knowledgeArea && (
					<div className='form-row mt-2'>
						<div className='col-md-12 faded-title'>
							<h5>Knowledge Area</h5>
						</div>
						<div className='col-md-12'>
							{question.knowledgeArea}
						</div>
					</div>
				)}
				<div className='form-row mt-2'>
					<div className='col-md-12 faded-title'>
						<h5>Sample answers</h5>
					</div>
					<div className='col-md-12'>
						{question.sampleAnswers.length > 0 ? (
							<ul>
								{question.sampleAnswers.map((answer, index) => (
									<li key={index} className='answer'>
										{answer}
									</li>
								))}
							</ul>
						) : (
							<div className='empty-sample-answer'>
								No sample answers
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuestionView;

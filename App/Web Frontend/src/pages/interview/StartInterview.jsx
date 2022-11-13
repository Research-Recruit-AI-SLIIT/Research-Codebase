import React from 'react';
import { useState } from 'react';
import { Loading } from '../../components/shared';
import InterviewSessionService from '../../services/InterviewSession.service';
import constants from '../../utils/constants';
import { toast } from 'react-toastify';
import './Interview.styles.css';
import { useContext } from 'react';
import { InterviewContext } from '../../store/interview';

const StartInterview = ({ interviewId, timeLimit, questions }) => {
	const [loading, setLoading] = useState(false);
	const { startInterviewSession } = useContext(InterviewContext);

	const onInterviewStart = () => {
		setLoading(true);
		InterviewSessionService.startInterviewSession(interviewId)
			.then((res) => {
				const interviewSession = res.interviewSession;
				startInterviewSession(
					interviewSession._id,
					interviewSession.interview,
					interviewSession.answers
				);
			})
			.catch((err) => {
				toast(err.data.message, { type: 'error' });
			})
			.finally(() => {
				setLoading(false);
			});
		// todo - start interview session
		// create service to start interview
	};
	return (
		<div className='row'>
			<div className='col-md-12 text-center'>
				<h1>Start interview</h1>
			</div>
			<div className='col-md-8 col-lg-8 offset-lg-2 col-sm-12 offset-md-2 mt-4 interview-instruction-background mb-3'>
				<h3 className='mt-3 font-weight-bold'>Interview Details</h3>
				<div className='row mt-3'>
					<div className='col-md-7'>
						<h5>Time for the interview - {timeLimit} Minutes</h5>
					</div>
					<div className='col-md-5'>
						<h5>Number of questions - {questions.length}</h5>
					</div>
				</div>
				<div className='row mt-3 justify-content-center'>
					<img
						src='https://i.imgur.com/iDpCB01.png'
						alt=''
						width={'30%'}
					/>
				</div>

				<hr />
				<h3>Instructions</h3>
				<div className='row mt-3'>
					<ul>
						{constants.interviewInstructions.map(
							(instruction, index) => {
								return (
									<li className='col-md-12' key={index}>
										<h5>{instruction.message}</h5>
									</li>
								);
							}
						)}
					</ul>
				</div>

				<hr />
				<div className='col-md-12 text-right my-4'>
					<button
						className='btn btn-black'
						onClick={onInterviewStart}
						disabled={loading}>
						{loading ? <Loading /> : 'Start Interview'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default StartInterview;

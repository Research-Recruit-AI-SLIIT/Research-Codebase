import React, { useContext, useState } from 'react';
import { InterviewContext } from '../../store/interview';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import InterviewService from '../../services/Interview.service';
import { Alert, Loading } from '../../components/shared';
import StartInterview from './StartInterview';
import Question from '../questions/Question';
import InterviewFooter from '../../components/interview-footer/InterviewFooter';
import InterviewSessionService from '../../services/InterviewSession.service';
import { toast } from 'react-toastify';
import FinishedInterview from '../../components/finished-interview/FinishedInterview';

const Interview = () => {
	const { id } = useParams();
	const [interview, setInterview] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const {
		currentStep,
		hydrate,
		questions,
		setCurrentStep,
		currentInterviewId
	} = useContext(InterviewContext);

	useEffect(() => {
		if (!hydrate(id)) {
			InterviewService.getInterview(id)
				.then((res) => {
					setInterview(res.interview);
				})
				.catch((err) => {
					setError('Error while loading the interview');
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			setIsLoading(false);
		}
	}, [id]);

	const finishInterview = async () => {
		InterviewSessionService.finishInterview(currentInterviewId)
			.then((res) => {
				setInterview(res.interview);
				setCurrentStep(questions.length + 1);

				toast("You've successfully completed the interview", {
					type: 'success'
				});
			})
			.catch((err) => {
				setError('Error while finishing the interview');
			});
	};

	const getStep = () => {
		console.log(currentInterviewId);
		if (currentStep === 0) {
			return (
				<StartInterview
					timeLimit={interview.time}
					questions={interview.questions}
					interviewId={interview._id}
				/>
			);
		} else if (currentStep > questions.length) {
			return <FinishedInterview />;
		} else {
			return (
				<Question
					isFinal={currentStep === questions.length}
					finishInterview={finishInterview}
				/>
			);
		}
	};
	const showFooter = () => {
		if (currentStep > 0 && currentStep <= questions.length) {
			return <InterviewFooter />;
		}
	};

	return (
		<div className='row mt-3'>
			<div className='col-md-12'>
				{isLoading ? (
					<div className='row justify-content-center m-5'>
						<Loading />
					</div>
				) : !!error ? (
					<Alert message={error} type='error' />
				) : (
					<>{getStep()}</>
				)}
			</div>
			{showFooter()}
		</div>
	);
};

export default Interview;

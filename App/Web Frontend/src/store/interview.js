import React, { createContext, useState, useEffect } from 'react';

const INITIAL_STATE = {
	isInterviewStarted: false,
	currentInterviewId: null,
	currentInterview: {},
	currentStep: 0,
	startTime: null,
	endTime: null,
	questions: []
};

const InterviewContext = createContext();

const InterviewProvider = ({ children }) => {
	const [state, setState] = useState(INITIAL_STATE);

	useEffect(() => {}, []);

	const startInterviewSession = (
		interviewSessionId,
		interview,
		questions
	) => {
		const currentInfo = {
			...state,
			currentInterviewId: interviewSessionId,
			currentInterview: interview,
			questions: questions,
			isInterviewStarted: true,
			startTime: new Date().getTime(),
			currentStep: 1,
			endTime: new Date().getTime() + interview.time * 60 * 1000
		};
		setState(currentInfo);
		localStorage.setItem('interviewSession', JSON.stringify(currentInfo));
	};

	const setInterviewStarted = (isInterviewStarted) => {
		setState({
			...state,
			isInterviewStarted
		});
	};

	const setCurrentInterview = (currentInterview) => {
		setState({
			...state,
			currentInterview
		});
	};

	const setCurrentStep = (currentStep) => {
		setState({
			...state,
			currentStep
		});
		const currentInfo = {
			...state,
			currentStep
		};
		localStorage.setItem('interviewSession', JSON.stringify(currentInfo));
	};

	const setStartTime = (startTime) => {
		setState({
			...state,
			startTime
		});
	};

	const isInterviewOver = () => {
		return new Date() > state.endTime;
	};

	const getCurrentStep = () => {
		return state.currentStep;
	};

	const getCurrentQuestion = () => {
		// check the time limit
		if (isInterviewOver()) {
			return null;
		}
		// sort questions by order
		// fileter and select the next available question which hasAnswered = false with smallest order number
		const questions = state.questions
			.sort((a, b) => a.question.questionOrder - b.question.questionOrder)
			.filter((q) => q.hasAnswered === false);
		return questions[0];
	};

	const hydrate = (id) => {
		//check if local storage has interviewSession
		//if yes, check the start time and end time
		// if the end time is less than the current time, then clear the local storage else set the state
		const interviewSession = JSON.parse(
			localStorage.getItem('interviewSession')
		);
		if (interviewSession) {
			const { endTime, currentInterview } = interviewSession;
			if (currentInterview._id === id) {
				if (new Date().getTime() > endTime) {
					localStorage.removeItem('interviewSession');
				} else {
					setState(interviewSession);
					return true;
				}
			} else {
				localStorage.removeItem('interviewSession');
			}
		}
		setState(INITIAL_STATE);
		return false;
	};

	const updateQuestion = (questionId) => {
		//update hasAnswered to true
		const questions = state.questions.map((q) => {
			if (q._id === questionId) {
				q.hasAnswered = true;
			}
			updateLocalStore();
			return q;
		});
	};

	const updateLocalStore = () => {
		localStorage.setItem('interviewSession', JSON.stringify(state));
	};
	return (
		<InterviewContext.Provider
			value={{
				isInterviewStarted: state.isInterviewStarted,
				currentInterviewId: state.currentInterviewId,
				currentInterview: state.currentInterview,
				currentStep: state.currentStep,
				startTime: state.startTime,
				endTime: state.endTime,
				questions: state.questions,
				setInterviewStarted,
				startInterviewSession,
				setCurrentInterview,
				setCurrentStep,
				setStartTime,
				isInterviewOver,
				getCurrentStep,
				getCurrentQuestion,
				hydrate,
				updateQuestion
			}}>
			{children}
		</InterviewContext.Provider>
	);
};

export { InterviewContext, InterviewProvider };

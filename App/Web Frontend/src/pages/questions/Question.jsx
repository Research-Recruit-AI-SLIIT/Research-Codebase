import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Loading } from '../../components/shared';
import VideoWrapper from '../../components/video-wrapper/VideoWrapper';
import InterviewSessionService from '../../services/InterviewSession.service';
import { InterviewContext } from '../../store/interview';
import constants from '../../utils/constants';
import { uploadFile } from '../../utils/file-upload.util';
import './Question.styles.css';
import axios from 'axios';

const Question = ({ isFinal, finishInterview }) => {
	const [videoData, setVideoData] = useState({
		video: null,
		hasRecorded: false
	});
	const [question, setQuestion] = useState(null);
	const [loading, setLoading] = useState(false);
	const { getCurrentQuestion, updateQuestion, setCurrentStep, currentStep } =
		useContext(InterviewContext);

	useEffect(() => {
		const question = getCurrentQuestion();
		setQuestion(question);
	}, [currentStep]);

	const onVideoRecordingComplete = (blob) => {
		setVideoData({
			video: blob,
			hasRecorded: true
		});
	};

	const onReRecord = () => {
		setVideoData({ video: null, hasRecorded: false });
	};

	const canSubmit = () => {
		return videoData.hasRecorded;
	};

	const onSubmit = async () => {
		setLoading(true);
		const uploaded = await uploadFile(videoData.video, question._id);
		if (uploaded) {
			InterviewSessionService.answerQuestion(
				question._id,
				`${constants.storage.baseUrl}/research/${question._id}.mp4`
			)
				.then((res) => {
					setVideoData({ video: null, hasRecorded: false });
					updateQuestion(question._id);
					setCurrentStep(currentStep + 1);
					//todo - add python URL HERE
					axios.post('https://recruitaibackend.herokuapp.com/mainpythonapp', {
						interviewAnswersId: question._id,
						video: `${constants.storage.baseUrl}/research/${question._id}.mp4`
					});
					toast('Question answered successfully', {
						type: 'success'
					});
					if (isFinal) {
						finishInterview();
					}
				})
				.catch((err) => {
					toast.error('Error while submitting the answer');
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setLoading(false);
			toast('Error uploading video', { type: 'error' });
		}
	};
	if (question === null) {
		return <div>Loading...</div>;
	}
	return (
		<div className='question-container'>
			<div className='question-text'>
				<span className='faded'>Question: </span>
				<h3>{question.question.question}</h3>
			</div>
			<div className='row'>
				<div className='col-md-12'>
					<VideoWrapper
						onComplete={onVideoRecordingComplete}
						onReRecord={onReRecord}
						videoData={videoData.video}
					/>
				</div>
			</div>
			<div className='row mt-5'>
				<div className='col-md-12 text-right'>
					<button
						className='btn btn-black w-25 mr-3'
						disabled={loading || !canSubmit()}
						onClick={onSubmit}>
						{loading ? (
							<Loading />
						) : (
							`Save and ${isFinal ? 'Finish' : 'Continue'}`
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Question;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InterviewCard from '../../components/interview-card/InterviewCard';
import { Alert, Loading } from '../../components/shared';
import InterviewService from '../../services/Interview.service';

const ViewInterviews = ({}) => {
	const [interviews, setInterviews] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		setIsLoading(true);
		InterviewService.getInterviews()
			.then((res) => {
				setInterviews(res.interviews);
			})
			.catch((err) => {
				setError(
					'Error while loading the interviews. Please try again later.'
				);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	return (
		<div>
			<div className='row'>
				{isLoading ? (
					<div className='col-md-12 text-center'>
						<Loading />
					</div>
				) : !!error ? (
					<div className='col-md-12 text-center'>
						<Alert message={error} type='error' />
					</div>
				) : interviews.length > 0 ? (
					interviews.map((interview) => (
						<InterviewCard
							key={interview._id}
							interview={interview}
						/>
					))
				) : (
					<div className='col-md-12 mt-4'>
						<Alert
							message={
								<div>
									<h5>No Interviews yet.</h5>
								</div>
							}
							type='info'
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default ViewInterviews;

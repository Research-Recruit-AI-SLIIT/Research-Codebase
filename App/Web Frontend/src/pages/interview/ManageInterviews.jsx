import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InterviewCard from '../../components/interview-card/InterviewCard';
import { Alert, Loading } from '../../components/shared';
import InterviewService from '../../services/Interview.service';

const ManageInterviews = ({}) => {
	const [interviews, setInterviews] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		setIsLoading(true);
		InterviewService.getMyManagedInterviews()
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

	const onDelete = (id) => {
		const newInterviews = interviews.filter(
			(interview) => interview._id !== id
		);
		setInterviews(newInterviews);
	};
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
							onDelete={onDelete}
						/>
					))
				) : (
					<div className='col-md-12 mt-4'>
						<Alert
							message={
								<div>
									<h5>
										You have not created any interview yet.
									</h5>
									<Link
										to='/add-interview'
										className='btn btn-black'>
										Create new Interview
									</Link>
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

export default ManageInterviews;

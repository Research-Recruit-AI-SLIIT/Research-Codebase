import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import InterviewSessionCard from '../../components/InterviewSessionCard/InterviewSessionCard';
import { Alert, Loading } from '../../components/shared';
import InterviewSessionService from '../../services/InterviewSession.service';
import { AuthContext } from '../../store/auth';

const MyInterviews = ({}) => {
	const [interviews, setInterviews] = useState([]);
	const [processedSessions, setProcessedSessions] = useState([]);
	const [newSessions, setNewSessions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const { getRole } = useContext(AuthContext);
	const role = getRole();
	useEffect(() => {
		if (role === 'candidate') {
			InterviewSessionService.getMyInterviews()
				.then((res) => {
					const inter = res.interviewSession;
					if (inter.length > 0) {
						setInterviews(inter);
						const processed = inter.filter(
							(i) => i.hasProcessed === true
						);
						setProcessedSessions(processed);
						const newSessions = inter.filter(
							(i) => i.hasProcessed === false
						);
						setNewSessions(newSessions);
					}
				})
				.catch((err) => {
					setError(true);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			InterviewSessionService.getRecruiterInterviews()
				.then((res) => {
					const inter = res.interviewSession;
					if (inter.length > 0) {
						setInterviews(inter);
						const processed = inter.filter(
							(i) => i.hasProcessed === true
						);
						setProcessedSessions(processed);
						const newSessions = inter.filter(
							(i) => i.hasProcessed === false
						);
						setNewSessions(newSessions);
					}
				})
				.catch((err) => {
					setError(true);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, []);
	return (
		<div className='row'>
			<div className='col-md-12 mb-4'>
				<span className='page-title'>Interview Sessions</span>
			</div>
			<>
				{loading ? (
					<div className='col-md-12 justify-content-center text-center'>
						<Loading />
					</div>
				) : error ? (
					<Alert
						message='Error while loading the interviews. Please try again later.'
						type='error'
					/>
				) : interviews.length > 0 ? (
					<div className='col-md-12'>
						{processedSessions.length > 0 ? (
							<div className='row'>
								<div className='col-md-12'>
									<h4>Completed sessions</h4>
								</div>
								<div className='col-md-12'>
									<div className='row'>
										{processedSessions.map((i) => (
											<InterviewSessionCard
												key={i._id}
												id={i._id}
												title={i.interview.name}
												hasProcessed={i.hasProcessed}
												position={i.interview.jobRole}
												organization={
													i.interview.organization
														.organizationName
												}
											/>
										))}
									</div>
								</div>
							</div>
						) : (
							<Alert>No Interviews has been processed yet</Alert>
						)}

						{newSessions.length > 0 ? (
							<div className='row mt-4'>
								<div className='col-md-12'>
									<h4>New sessions</h4>
								</div>
								<div className='col-md-12'>
									<div className='row justify-content-between'>
										{newSessions.map((i) => (
											<InterviewSessionCard
												key={i._id}
												id={i._id}
												title={i.interview.name}
												hasProcessed={i.hasProcessed}
												position={i.interview.jobRole}
												organization={
													i.interview.organization
														.organizationName
												}
											/>
										))}
									</div>
								</div>
							</div>
						) : (
							<Alert>No New Interviews found</Alert>
						)}
					</div>
				) : (
					<div className='col-md-6 offset-md-3 mt-3'>
						<Alert message='No Interviews found' type='info' />
					</div>
				)}
			</>
		</div>
	);
};

export default MyInterviews;

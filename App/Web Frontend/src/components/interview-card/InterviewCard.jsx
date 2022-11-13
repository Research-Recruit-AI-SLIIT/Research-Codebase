import React, { useContext } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import InterviewService from '../../services/Interview.service';
import { AuthContext } from '../../store/auth';
import Card from '../card/Card';
import './InterviewCard.styles.css';
import InterviewCardRow from './InterviewCardRow';

const InterviewCard = ({ interview, onDelete }) => {
	const { getRole } = useContext(AuthContext);
	const role = getRole();
	const isShowEditOptions = role === 'admin' || role === 'recruiter';
	const deleteInterview = () => {
		if (window.confirm('Are you sure you want to delete this interview?')) {
			InterviewService.deleteInterview(interview._id)
				.then((res) => {
					toast.success('Interview deleted successfully', {
						type: 'success'
					});
					onDelete(interview._id);
				})
				.catch((err) => {
					toast(
						'Error while deleting the interview. Please try again later.',
						{ type: 'error' }
					);
				});
		}
	};
	return (
		<div className='col-md-4 my-2'>
			<Card>
				<div className='row'>
					<InterviewCardRow label='Name' value={interview.name} />
					<InterviewCardRow label='Type' value={interview.type} />
					<InterviewCardRow label='Role' value={interview.jobRole} />
					<InterviewCardRow
						label='Category'
						value={interview.interviewCategory.name}
					/>
					<hr />
					{isShowEditOptions ? (
						<>
							<div className='col-md-8'>
								<Link
									to={`/add-questions/${interview._id}`}
									className='btn btn-black'>
									Add Questions
								</Link>
							</div>
							<Link
								to={`/update-interview/${interview._id}`}
								className='col-md-2'>
								<FaPen
									color='blue'
									className='cursor-pointer'
								/>
							</Link>
							<div className='col-md-2'>
								<FaTrash
									color='red'
									className='cursor-pointer'
									onClick={deleteInterview}
								/>
							</div>
						</>
					) : (
						<div className='col-md-8'>
							<Link
								to={`/interview/${interview._id}`}
								className='btn btn-black'>
								Start Interview
							</Link>
						</div>
					)}
				</div>
			</Card>
		</div>
	);
};

export default InterviewCard;

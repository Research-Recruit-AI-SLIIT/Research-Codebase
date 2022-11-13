import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../card/Card';
import InterviewCardRow from '../interview-card/InterviewCardRow';

const InterviewSessionCard = ({
	id,
	title,
	position,
	organization,
	hasProcessed
}) => {
	return (
		<div className={`col-md-4 my-2`}>
			<Card>
				<InterviewCardRow label='Title' value={title} />
				<InterviewCardRow label='Position' value={position} />
				<InterviewCardRow label='Organization' value={organization} />
				<InterviewCardRow
					label='Status'
					value={
						hasProcessed ? (
							<span className='badge bg-success rounded-pill mb-2 text-light'>
								Processed
							</span>
						) : (
							<span className='badge bg-danger rounded-pill mb-2 text-light'>
								Processing
							</span>
						)
					}
				/>
				{hasProcessed && (
					<div className='col-md-12'>
						<Link
							className='btn btn-black w-100'
							to={`/my-interview-session/${id}`}>
							View Results
						</Link>
					</div>
				)}
			</Card>
		</div>
	);
};

export default InterviewSessionCard;

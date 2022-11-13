import React from 'react';
import Confetti from 'react-confetti';
import './FinishedInterview.styles.css';

const FinishedInterview = () => {
	return (
		<div className='finished-interview-container'>
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				style={{ position: 'fixed' }}
			/>

			<div className='overlay'>
				<span>Interview finished</span>
				<button className='btn btn-black d-block w-100'>
					View your interview
				</button>
			</div>
		</div>
	);
};

export default FinishedInterview;

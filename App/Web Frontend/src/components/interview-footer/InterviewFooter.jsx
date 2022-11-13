import React, { useContext, useEffect } from 'react';
import { InterviewContext } from '../../store/interview';
import './InterviewFooter.styles.css';

const InterviewFooter = () => {
	const { endTime, questions, currentStep } = useContext(InterviewContext);
	const [time, setTime] = React.useState('');
	useEffect(() => {
		const interval = setInterval(() => {
			const currentTime = new Date().getTime();

			setTime(secondsToHms((endTime - currentTime) / 1000));
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	function secondsToHms($) {
		var o = Math.floor(($ = Number($)) / 3600),
			s = Math.floor(($ % 3600) / 60),
			e = Math.floor(($ % 3600) % 60);
		return o < 0 && s < 0 && e < 0
			? 'TIME OUT, Please submit the answer'
			: (o > 0 ? o + (1 == o ? ' hour, ' : ' hours, ') : '') +
					(s > 0 ? s + (1 == s ? ' minute, ' : ' minutes, ') : '') +
					(e > 0 ? e + (1 == e ? ' second' : ' seconds') : '');
	}
	return (
		<div className='interview-footer'>
			<div className='row text-center'>
				<div className='col-md-3'>
					Time left:
					<h5 className='bold-text'>{time}</h5>
				</div>
				<div className='col-md-3'>
					Current Question:
					<h3 className='bold-text'>{currentStep}</h3>
				</div>

				<div className='col-md-3'>
					Question Left:
					<h5 className='bold-text'>
						{questions.length - currentStep}
					</h5>
				</div>

				<div className='col-md-3'>
					Questions:
					<h5 className='bold-text'>
						{JSON.stringify(questions.length)}
					</h5>
				</div>
			</div>
		</div>
	);
};

export default InterviewFooter;

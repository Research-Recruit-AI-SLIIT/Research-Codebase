import React from 'react';
import LineChartx from '../../../components/graphs/LineChart';
import SectionDataRow from '../../../components/section/SectionDataRow';
import SectionTitle from '../../../components/section/SectionTitle';
import { getFillerPausesCount } from '../../../utils/utils';

const LanguageFluency = ({ interviewSession }) => {
	return (
		<div className='row mt-5 justify-content-center section-container'>
			<div className='col-md-12'>
				<div className='row  justify-content-center'>
					<div className='col-md-4'>
						<SectionTitle title='Language Fluency' />
						<SectionDataRow
							title='Total Filler Pauses Count'
							value={interviewSession.result.avgFillerPausesCount}
						/>
						<SectionDataRow
							title='Total Silence Pause Count'
							value={interviewSession.result.avgSilencePauseCount}
						/>
						<SectionDataRow
							title='Average Filler Words Percentage per Question'
							value={
								interviewSession.result.avgFillerWordsPercentage
							}
						/>
						<br></br>
						<br></br>
						<p style={{color:'gray'}}><i>If the Filler Pauses Count, Silence Pause Count and Filler Words Percentage is High then your Language Fluency can be considered as Low. </i></p>
					</div>
					<div className='col-md-6'>
						<LineChartx
							data={getFillerPausesCount(
								interviewSession.answers,
								'fillerPausesCount'
							)}
							yDataKey='fillerPausesCount'
						/>
					</div>
				</div>
				<div className='row mt-5 justify-content-center'>
					<div className='col-md-6'>
						<LineChartx
							data={getFillerPausesCount(
								interviewSession.answers,
								'silencePausesCount'
							)}
							yDataKey='silencePausesCount'
						/>
					</div>
					<div className='col-md-6'>
						<LineChartx
							data={getFillerPausesCount(
								interviewSession.answers,
								'fillerWordsPercentage'
							)}
							yDataKey='fillerWordsPercentage'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LanguageFluency;

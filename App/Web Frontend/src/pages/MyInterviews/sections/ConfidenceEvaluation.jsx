import React from 'react';
import BarChartx from '../../../components/graphs/BarChart';
import SectionDataRow from '../../../components/section/SectionDataRow';
import SectionTitle from '../../../components/section/SectionTitle';
import { getConfidenceEvaluationData } from '../../../utils/utils';
import { getBadge, getClassByWord, getColorByWord } from "../../../utils/utils";

const ConfidenceEvaluation = ({ interviewSession }) => {
	return (
		<div className='row mt-5 justify-content-center section-container'>
			<div className='col-md-4'>
				<SectionTitle title='Confidence Evaluation' />
				<div>
					<b>Overall Evaluation</b>
					<CustomCell value={interviewSession.result.confidence} />
				</div>
			</div>
			<div className='col-md-6'>
				<BarChartx
					data={getConfidenceEvaluationData(interviewSession.answers)}
				/>
			</div>
		</div>
	);
};

const CustomCell = ({ value }) => {
	return (
	  <td
	  >
		{value ? getBadge(value) : "-"}
	  </td>
	);
  };

export default ConfidenceEvaluation;

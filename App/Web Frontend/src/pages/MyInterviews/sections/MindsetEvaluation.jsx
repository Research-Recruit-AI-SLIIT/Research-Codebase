import React from 'react';
import BarChartx from '../../../components/graphs/BarChart';
import SectionDataRow from '../../../components/section/SectionDataRow';
import SectionTitle from '../../../components/section/SectionTitle';
import { getMindsetEvaluationData } from '../../../utils/utils';
import { getBadge, getClassByWord, getColorByWord } from "../../../utils/utils";

const MindsetEvaluation = ({ interviewSession }) => {
	return (
		<div className='row mt-5 justify-content-center section-container'>
			<div className='col-md-4'>
				<SectionTitle title='Mindset Evaluation' />
				<div>
					<b>Overall Evaluation</b>
					<CustomCell value={interviewSession.result.mindset} />
				</div>
			</div>
			<div className='col-md-6'>
				<BarChartx
					data={getMindsetEvaluationData(interviewSession.answers)}
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

export default MindsetEvaluation;

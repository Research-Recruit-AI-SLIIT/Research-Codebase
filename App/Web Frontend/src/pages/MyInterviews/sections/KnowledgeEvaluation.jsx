import React from 'react';
import PieChartx from '../../../components/graphs/PieChart';
import SectionDataRow from '../../../components/section/SectionDataRow';
import SectionTitle from '../../../components/section/SectionTitle';
import { getKnowledgeEvaluationData } from '../../../utils/utils';
import { getBadge, getClassByWord, getColorByWord } from "../../../utils/utils";

const KnowledgeEvaluation = ({ interviewSession }) => {
	return (
		<div className='row justify-content-center section-container'>
			<div className='col-md-4'>
				<SectionTitle title='Knowledge Evaluation' />
				<div>
					<b>Overall Evaluation</b>
					<CustomCell value={interviewSession.result.knowledge} />
				</div>
				<br></br>
				<SectionDataRow
					title='Acceptable Answers'
					value={
						getKnowledgeEvaluationData(interviewSession.answers)[0][
							'value'
						]
					}
				/>
				<SectionDataRow
					title='Not Acceptable Answers'
					value={
						getKnowledgeEvaluationData(interviewSession.answers)[1][
							'value'
						]
					}
				/>
				<SectionDataRow
					title='Improvemnet Required Answers'
					value={
						getKnowledgeEvaluationData(interviewSession.answers)[2][
							'value'
						]
					}
				/>
			</div>
			<div className='col-md-6'>
				<PieChartx
					data={getKnowledgeEvaluationData(interviewSession.answers)}
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

export default KnowledgeEvaluation;

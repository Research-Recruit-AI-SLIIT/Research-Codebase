import React from 'react';
import SectionDataRow from '../../../components/section/SectionDataRow';
import SectionTitle from '../../../components/section/SectionTitle';
import { getBadge, getClassByWord, getColorByWord } from "../../../utils/utils"; 

const OtherEvaluations = ({ interviewSession }) => {
	{/*interviewSession.result.personality is an array need to take each value*/}

	console.log(interviewSession.result.personality);

	let personalities = (interviewSession.result.personality).map((personality) => {
		console.log(personality);
		return <div> <CustomCell value={personality} /></div>
	});
	return (
		<div className='row mt-5 justify-content-center section-container'>
			<div className='col-md-4'>
				<SectionTitle title='Personality Evaluation' />
				<div>
					<b>Overall Personality Characteristics</b><br></br><br></br>
					{personalities}
				</div>
			</div>
			<div className='col-md-4 offset-md-1'>
				<SectionTitle title='Unothorized Objects' />
				{interviewSession.result.unAuthorizedObjects.map(
					(object, index) => (
						<SectionDataRow key={index} title={''} value={object} />
					)
				)}
			</div>
		</div>
	);
};


const CustomCell = ({ value }) => {
	if (value === "Openness") {
		value = "Being anxious,irritable,temperamental and moody";
	} else if (value === "Conscientiousness") {
		value = "Being anxious,irritable,temperamental and moody";
	} else if (value === "Extraversion") {
		value = "Being outgoing,talkative,sociable,and enjoying social situation";
	} else if (value === "Agreeableness") {
		value = "Being affable,tolerant,sensitive,trusting,kind and warm";
	} else if (value === "Neuroticism") {
		value = "Being anxious,irritable,temperamental and moody";
	}

	return (
	  <td
	  >
		{value ? getBadge(value) : "-"}
	  </td>
	);
  };

export default OtherEvaluations;

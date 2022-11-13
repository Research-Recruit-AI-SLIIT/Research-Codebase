import React from "react";
import { getBadge, getClassByWord, getColorByWord } from "../../../utils/utils";


const AnswerEvaluation = ({ interviewSession }) => {
  const answers = interviewSession.answers;

  return (
    <div className="row mt-5 mb-4 ">
      <div className="col-md-12">
        <h3>Question Evaluation</h3>
      </div>
      <div className="col-md-12">
        <table class="table table-bordered w-100">
          <thead>
            <tr>
              <th scope="col">Question</th>
              <th scope="col">Knowledge</th>
              <th scope="col">Personality</th>
              <th scope="col">Confidence</th>
              <th scope="col">Mindset</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((answer, index) => {
              const result = answer.result;
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <CustomCell value={result.knowledge} />
                  <CustomCell value={result.personality} />
                  <CustomCell value={result.confidence} />
                  <CustomCell value={result.mindset} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Include meanings of the Personality Values in a Note below this*/}
      <div className="col-md-12">
        <h6>Note</h6>
        <p>
          Openness - being curious,orginal,intellectual,creative and open to new
          ideas
          <br></br>
          Conscientiousness - being organized,systematic,punctual,archivement
          oriented and dependable
          <br></br>
          Extraversion - being outgoing,talkative,sociable,and enjoying social
          situation
          <br></br>
          Agreeableness - being affable,tolerant,sensitive,trusting,kind and
          warm
          <br></br>
          Neuroticism - being anxious,irritable,temperamental and moody
        </p>
      </div>
    </div>
  );
};

const CustomCell = ({ value }) => {
  return (
    <td
      style={{
        backgroundColor: getColorByWord(value),
      }}
    >
      {value ? getBadge(value) : "-"}
    </td>
  );
};
export default AnswerEvaluation;

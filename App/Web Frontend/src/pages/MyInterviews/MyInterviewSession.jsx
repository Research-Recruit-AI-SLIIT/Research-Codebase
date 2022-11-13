import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Loading } from "../../components/shared";
import InterviewSessionService from "../../services/InterviewSession.service";
import ConfidenceEvaluation from "./sections/ConfidenceEvaluation";
import KnowledgeEvaluation from "./sections/KnowledgeEvaluation";
import LanguageFluency from "./sections/LanguageFluency";
import MindsetEvaluation from "./sections/MindsetEvaluation";
import OtherEvaluations from "./sections/OtherEvaluations";
import AnswerEvaluation from "./sections/AnswerEvaluation";
import Insights from "./sections/Insights"
import HorizontalGauge from "react-horizontal-gauge";

const MyInterviewSession = () => {
  const [isLoading, setLoading] = useState(true);
  const [interviewSession, setInterviewSession] = useState({});
  const [error, setError] = useState(false);
  const { id } = useParams();
  const gaugeTicks = [
    { label: "Poor", value: 0 },
    { label: "Good", value: 100 },
  ];
  useEffect(() => {
    InterviewSessionService.getInterviewSession(id)
      .then((res) => {
        setInterviewSession(res.interviewSession);
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div className="row">
      <div className="col-md-12 ">
        <br></br>
        <span className="page-title" style={{color:"gray"}}>Evaluation Report of the Interview</span>
      </div>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Alert
          message="Error while loading the interview session. Please try again later."
          type="error"
        />
      ) : (
        <>
          <div className="col-md-12 mt-5">
            <div className="col-md-12">
              <HorizontalGauge
                ticks={gaugeTicks}
                height={70}
                width={1100}
                min={0}
                max={100}
                value={73}
              />
            </div>
			<br></br>
			<br></br>
            <KnowledgeEvaluation interviewSession={interviewSession} />
            <ConfidenceEvaluation interviewSession={interviewSession} />

            <MindsetEvaluation interviewSession={interviewSession} />
            <LanguageFluency interviewSession={interviewSession} />

            <OtherEvaluations interviewSession={interviewSession} />

			<Insights interviewSession={interviewSession} />

            <AnswerEvaluation interviewSession={interviewSession} />
          </div>
        </>
      )}
    </div>
  );
};

export default MyInterviewSession;

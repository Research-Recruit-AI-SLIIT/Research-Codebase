import React from "react";
import PieChartx from "../../../components/graphs/PieChart";
import SectionDataRow from "../../../components/section/SectionDataRow";
import SectionTitle from "../../../components/section/SectionTitle";
import { getKnowledgeEvaluationData } from "../../../utils/utils";
import { getBadge, getClassByWord, getColorByWord } from "../../../utils/utils";
import Alert from "@mui/material/Alert";

const Insights = ({ interviewSession }) => {
  interviewSession = interviewSession.result;
  const goodFeedbacks = interviewSession.insights.goodFeedback;
  const badFeedbacks = interviewSession.insights.badFeedback;
  const avgFeedbacks = interviewSession.insights.avgFeedback;
  const goodKnowledgeAreas = interviewSession.insights.goodKnowledgeAreas;
  const badKnowledgeAreas = interviewSession.insights.badKnowledgeAreas;

  const displayGoodFeedbacks = () => {
    return goodFeedbacks.map((feedback) => {
      return (
        <div>
          <Alert severity="success">{feedback}</Alert>
          <br></br>
        </div>
      );
    });
  }

  const displayAvgFeedbacks = () => {
    return avgFeedbacks.map((feedback) => {
      return (
        <div>
          <Alert severity="warning">{feedback}</Alert>
          <br></br>
        </div>
      );
    });
  }

  const displayBadFeedbacks = () => {
    return badFeedbacks.map((feedback) => {
      return (
        <div>
          <Alert severity="error">{feedback}</Alert>
          <br></br>
        </div>
      );
    });
  }

  const displayGoodKnowledgeAreas = () => {
    if (goodKnowledgeAreas.length === 0) {
      return (
        <div>
        </div>
      );
    } else {
      return (
        <div>
        <b>You have excellent knowledge in the following areas. Great!</b>
        <br></br>
        <br></br>
        {goodKnowledgeAreas.map((knowledgeArea) => {
          return (
            <div>
              <Alert severity="success" icon={false} variant="outlined">{knowledgeArea}</Alert>
              <br></br>
            </div>
          );
        })}
        <br></br>
        </div>

      );
    }
  }

  const displayBadKnowledgeAreas = () => {
    if (badKnowledgeAreas.length === 0) {
      return (
        <div>
        </div>
      );
    } else {
      return (
        <div>
        <p>You need to improve your knowledge in following areas:</p>
        <br></br>
        <br></br>
        {badKnowledgeAreas.map((knowledgeArea) => {
          return (
            <div>
              <Alert severity="error">{knowledgeArea}</Alert>
              <br></br>
            </div>
          );
        })}
        <br></br>
        </div>

      );
    }
  }




  return (
    <div className="row mt-5 justify-content-center section-container">
      <div className="col-md-6">
        <SectionTitle title="Insights" />
        <div>
          {displayGoodFeedbacks()}
          {displayAvgFeedbacks()}
          {displayBadFeedbacks()}
          {displayGoodKnowledgeAreas()}
          {displayBadKnowledgeAreas()}
        </div>
      </div>
      <div className="col-md-4">
        <img
          src="https://static.vecteezy.com/system/resources/previews/001/861/251/non_2x/illustration-data-insight-vector.jpg"
          alt="insights"
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

const CustomCell = ({ value }) => {
  return <td>{value ? getBadge(value) : "-"}</td>;
};

export default Insights;

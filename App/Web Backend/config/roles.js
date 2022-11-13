const allRoles = {
  candidate: ['createInterviewSession', 'answerInterviewQuestion', 'completeInterviewSession', 'getMyInterviewSessions'],
  recruiter: [
    'addOrganization',
    'createQuestion',
    'createInterview',
    'addQuestionToInterview',
    'updateInterviewQuestion',
    'updateInterview',
    'deleteInterview',
    'deleteInterviewQuestion',
    'getRecruiterInterviewSessions',
  ],
  admin: [
    'addCategory',
    'addOrganization',
    'createQuestion',
    'createInterview',
    'addQuestionToInterview',
    'updateInterviewQuestion',
    'updateInterview',
    'deleteInterview',
    'deleteInterviewQuestion',
    'getRecruiterInterviewSessions',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};

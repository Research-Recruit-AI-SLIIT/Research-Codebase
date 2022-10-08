const allRoles = {
  candidate: ['createInterviewSession', 'answerInterviewQuestion', 'completeInterviewSession'],
  recruiter: [
    'addOrganization',
    'createQuestion',
    'createInterview',
    'addQuestionToInterview',
    'updateInterviewQuestion',
    'updateInterview',
    'deleteInterview',
    'deleteInterviewQuestion',
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
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};

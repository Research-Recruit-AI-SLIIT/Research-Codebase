const router = require('express').Router();
const { interviewValidation } = require('../validations');
const { interviewController } = require('../controllers');
const auth = require('../middlewares/auth');

const validate = require('../middlewares/validate');

router.post(
  '/create-category',
  auth('addCategory'),
  validate(interviewValidation.interviewCategoryCreate),
  interviewController.createInterviewCategory
);
router.get('/get-categories', interviewController.getInterviewCategories);

router.post(
  '/create-interview',
  auth('createInterview'),
  validate(interviewValidation.createInterview),
  interviewController.createInterview
);
router.get('/get-interviews', interviewController.getInterviews);
router.get('/get-interview/id/:id', validate(interviewValidation.getInterviewById), interviewController.getInterviewById);
router.get(
  '/get-interviews-by-category-id/:id',
  validate(interviewValidation.getInterviewById),
  interviewController.getInterviewsByCategoryId
);

router.get(
  '/get-interviews-by-organization-id/:id',
  validate(interviewValidation.getInterviewById),
  interviewController.getInterviewsByOrganizationId
);

router.put(
  '/add-question-to-interview',
  auth('addQuestionToInterview'),
  validate(interviewValidation.addQuestionToInterview),
  interviewController.addQuestionToInterview
);

router.put(
  '/update-interview-question',
  auth('updateInterviewQuestion'),
  validate(interviewValidation.updateInterviewQuestion),
  interviewController.updateInterviewQuestion
);

router.put(
  '/update-interview',
  auth('updateInterview'),
  validate(interviewValidation.updateInterview),
  interviewController.updateInterview
);

router.delete(
  '/delete-interview/:id',
  auth('deleteInterview'),
  validate(interviewValidation.deleteInterview),
  interviewController.deleteInterview
);

router.delete(
  '/delete-interview-question/:id',
  auth('deleteInterviewQuestion'),
  validate(interviewValidation.deleteInterview),
  interviewController.deleteInterviewQuestion
);

router.get('/get-interviews-by-creator', auth('createInterview'), interviewController.getInterviewsByCreatedBy);

module.exports = router;

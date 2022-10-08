const router = require('express').Router();
const { interviewAnswerValidation } = require('../validations');
const { interviewAnswerController } = require('../controllers');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.put(
  '/answer',
  auth('answerInterviewQuestion'),
  validate(interviewAnswerValidation.answerTheQuestion),
  interviewAnswerController.addAnswer
);
module.exports = router;

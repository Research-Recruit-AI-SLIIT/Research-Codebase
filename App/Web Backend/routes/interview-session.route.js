const router = require('express').Router();
const { interviewSessionValidation } = require('../validations');
const { interviewSessionController } = require('../controllers');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.post(
  '/',
  auth('createInterviewSession'),
  validate(interviewSessionValidation.interviewSessionCreate),
  interviewSessionController.createInterviewSession
);

router.put(
  '/finish',
  auth('completeInterviewSession'),
  validate(interviewSessionValidation.interviewSessionComplete),
  interviewSessionController.completeInterviewSession
);

router.get('/get/:id', interviewSessionController.getInterviewSessionById);

module.exports = router;

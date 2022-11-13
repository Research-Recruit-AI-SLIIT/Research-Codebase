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

router.get('/my-interviews', auth('getMyInterviewSessions'), interviewSessionController.getInterviewSessionByUserId);
router.get(
  '/get-recruiter-interviews',
  auth('getRecruiterInterviewSessions'),
  interviewSessionController.getRecruiterInterviewSessions
);
router.get('/get/:id', interviewSessionController.getInterviewSessionById);

module.exports = router;
